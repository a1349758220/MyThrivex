# ThriveX-Server Java 版本升级记录

**日期**: 2026-05-03

## 概述

将项目 Java 版本从 **1.8** 升级至 **17**。

## 详细变动

### 1. 父级 pom.xml

| 配置项 | 旧值 | 新值 |
|--------|------|------|
| `java.version` | `1.8` | `17` |
| `maven-compiler-plugin` 版本 | `3.1` | `3.11.0` |

`maven-compiler-plugin` 的 `source` 和 `target` 通过 `${java.version}` 属性引用，无需额外修改。

### 2. blog/pom.xml

| 配置项 | 旧值 | 新值 |
|--------|------|------|
| `maven.compiler.source` | `8` | `17` |
| `maven.compiler.target` | `8` | `17` |

### 3. model/pom.xml

| 配置项 | 旧值 | 新值 |
|--------|------|------|
| `maven.compiler.source` | `8` | `17` |
| `maven.compiler.target` | `8` | `17` |

## 兼容性说明

- **Spring Boot 2.7.12** 原生支持 Java 17，无需升级框架版本
- `maven-compiler-plugin` 旧版 `3.1` 不支持 Java 17 编译，已同步升级至 `3.11.0`

## 注意事项

1. 确保本地开发环境已安装 **JDK 17**
2. Java 11+ 移除了 `javax.xml.bind`，如项目中有 XML 绑定相关代码，需额外添加 JAXB 依赖
3. 建议升级后完整编译测试，确保所有模块编译通过
