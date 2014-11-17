package com.winterbe.javadoc;

/**
 * @author Benjamin Winterberg
 */
public enum FileType {
    CLASS,
    INTERFACE,
    ENUM,
    ANNOTATION,
    UNKNOWN;

    public static FileType ofFullType(String fullType) {
        if (fullType.startsWith("Class")) {
            return CLASS;
        }
        if (fullType.startsWith("Interface")) {
            return INTERFACE;
        }
        if (fullType.startsWith("Enum")) {
            return ENUM;
        }
        if (fullType.startsWith("Annotation")) {
            return ANNOTATION;
        }
        return UNKNOWN;
    }
}