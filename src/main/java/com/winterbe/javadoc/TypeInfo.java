package com.winterbe.javadoc;

import org.apache.commons.lang3.StringUtils;

/**
 * @author Benjamin Winterberg
 */
public class TypeInfo {
    private String name;
    private String packageName;
    private String path;
    private FileType fileType;

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getId() {
        String id = packageName + name;
        return StringUtils.remove(id, '.');
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}