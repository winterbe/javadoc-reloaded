package com.winterbe.javadoc;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * @author Benjamin Winterberg
 */
public class SiteCreator {

    public void createSite(ExplorerResult result) throws IOException, URISyntaxException {
        List<TypeInfo> typeInfos = result.getTypeInfos();

        ObjectMapper objectMapper = new ObjectMapper();
        String data = objectMapper.writeValueAsString(typeInfos);

        URL url = getClass()
                .getClassLoader()
                .getResource("index.template.html");

        URI uri = url.toURI();
        Path path = Paths.get(uri);
        byte[] bytes = Files.readAllBytes(path);

        String template = new String(bytes, StandardCharsets.UTF_8);
        template = StringUtils.replaceOnce(template, "'{{DATA}}'", data);

        File file = new File("_site/index.html");
        BufferedWriter htmlWriter = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF-8"));
        htmlWriter.write(template);
        htmlWriter.flush();
        htmlWriter.close();
    }

}
