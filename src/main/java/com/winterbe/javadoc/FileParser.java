package com.winterbe.javadoc;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Optional;

/**
 * @author Benjamin Winterberg
 */
public class FileParser {

    public Optional<TypeInfo> parse(File file, String path) throws IOException {
        if (!file.exists()) {
            throw new FileNotFoundException("file does not exist: " + file.getAbsolutePath());
        }

        Document document = Jsoup.parse(file, "UTF-8", "http://download.java.net/jdk8/docs/api/");

        try {
            return getTypeInfo(document, path);
        }
        catch (Exception e) {
            System.err.println("failed to parse file " + file.getAbsolutePath() + ": " + e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<TypeInfo> getTypeInfo(Document document, String path) {
        String title = document.title();
        String typeName = StringUtils.substringBefore(title, " ");

        Element body = document.body();

        String fullType = body
                .select(".header h2")
                .first()
                .text();

        String packageName = body
                .select(".header > .subTitle")
                .last()
                .text();

        TypeInfo typeInfo = new TypeInfo();
        typeInfo.setName(typeName);

        FileType fileType = FileType.ofFullType(fullType);
        typeInfo.setFileType(fileType);

        typeInfo.setPackageName(packageName);
        typeInfo.setPath(path);

        body.select(".contentContainer .description dl dt .simpleTagLabel")
                .stream()
                .filter(el -> el.text().contains("Since"))
                .findFirst()
                .ifPresent(el -> {
                    String version = el.parent().nextElementSibling().text();
                    typeInfo.setVersion(version);
                });

        body.select(".inheritance > li:first-of-type > a")
                .stream()
                .map(el -> StringUtils.lowerCase(el.text()))
                .map(s -> StringUtils.substringAfterLast(s, "."))
                .forEach(type -> {
                    String filterExtends = typeInfo.getFilterExtends();
                    typeInfo.setFilterExtends(filterExtends + " " + type);
                });

        body.select(".contentContainer > .description > ul.blockList > li.blockList > dl > dt")
                .stream()
                .filter(el ->
                        el.text().contains("All Implemented Interfaces:") ||
                        el.text().contains("All Superinterfaces:"))
                .findFirst()
                .ifPresent(el -> el.nextElementSibling().select("a")
                        .stream()
                        .map(a -> StringUtils.lowerCase(a.text()))
                        .forEach(type -> {
                            String filterExtends = typeInfo.getFilterExtends();
                            typeInfo.setFilterExtends(filterExtends + " " + type);
                        }));

        return Optional.of(typeInfo);
    }
}