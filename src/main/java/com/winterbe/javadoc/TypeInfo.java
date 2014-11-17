package com.winterbe.javadoc;

/**
 * @author Benjamin Winterberg
 */
public class TypeInfo {
    private String name;
    private String packageName;
    private String path;

    private FileType fileType = FileType.UNKNOWN;
    private String version = "undefined";

    private String filterExtends = "";
    private String filterIs = "";
    private String filterHas = "";

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getFilterExtends() {
        return filterExtends;
    }

    public void setFilterExtends(String filterExtends) {
        this.filterExtends = filterExtends;
    }

    public String getFilterIs() {
        return filterIs;
    }

    public void setFilterIs(String filterIs) {
        this.filterIs = filterIs;
    }

    public String getFilterHas() {
        return filterHas;
    }

    public void setFilterHas(String filterHas) {
        this.filterHas = filterHas;
    }

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