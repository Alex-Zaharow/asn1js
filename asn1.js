// ASN.1 JavaScript decoder
// http://www.oid-info.com/get/2.5.4.10
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
/*global oids */
(function (undefined) {
"use strict";

var arrOids =   {
                    // Дополнения сертификата:
                    "1.2.643.100.111": "Subject Sign Tool, средство электронной подписи владельца сертификата.\nДля указания в квалифицированном сертификате наименования используемого владельцем квалифицированного сертификата средства электронной подписи ",
                    "1.2.643.100.112": "Issuer Sign Tool, средство Электронной Подписи Удостоверяющего Центра.\nИмеющего следующее представление:\nIssuerSignTool := SEQUENCE {\n      signTool     UTF8String SIZE(1..200),\n      cATool       UTF8String SIZE(1..200),\n      signToolCert UTF8String SIZE(1..100),\n      cAToolCert   UTF8String SIZE(1..100) }.\nВ строковом поле signTool должно содержаться полное наименование средства электронной подписи, которое было использовано для создания ключа электронной подписи, ключа проверки электронной подписи и квалифицированного сертификата.\nВ строковом поле cATool должно содержаться полное наименование средства аккредитованного Удостоверяющего центра, которое было использовано для создания ключа электронной подписи, ключа проверки электронной подписи и квалифицированного сертификата.\nВ строковом поле signToolCert должны содержаться реквизиты заключения ФСБ России о подтверждении соответствия средства электронной подписи, которое было использовано для создания ключа электронной подписи, ключа проверки электронной подписи, требованиям, установленным в соответствии с Федеральным законом.\nВ строковом поле cAToolCert должны содержаться реквизиты заключения ФСБ России о подтверждении соответствия средства Удостоверяющего центра, которое было использовано для создания квалифицированного сертификата, требованиям, установленным в соответствии с Федеральным законом",
                    "1.2.643.100.113.1": "класс средства ЭП владельца квалифицированного сертификата КС1",
                    "1.2.643.100.113.2": "класс средства ЭП владельца квалифицированного сертификата КС1,КС2",
                    "1.2.643.100.113.3": "класс средства ЭП владельца квалифицированного сертификата КС1,КС2,КС3",
                    "1.2.643.100.113.4": "класс средства ЭП владельца квалифицированного сертификата КС1,КС2,КС3,КВ1",
                    "1.2.643.100.113.5": "класс средства ЭП владельца квалифицированного сертификата КС1,КС2,КС3,КВ1,КВ2",
                    "1.2.643.100.113.6": "класс средства ЭП владельца квалифицированного сертификата КС1,КС2,КС3,КВ1,КВ2,КА1",
                    
                    // Состав имени субъекта:
                    "1.2.643.100.1": "Состав имени субъекта:\nOGRN\nОГРН (13 символов). ОГРН организации (только для ЮЛ)\n\nСостав имени издателя СКПЭП:\nOGRN\nОГРН (13 символов). ОГРН организации.\n\nМожет быть  использовано только в одном экземпляре",
                    "1.2.643.100.3": "Состав имени субъекта:\nSNILS\nСНИЛС (11 символов)\nФЛ: СНИЛС\nЮЛ: Не обязательно, но в случае выпуска СКПЭП на должностное лицо – данное поле строго рекомендуется включать для упрощения идентификации должностных лиц.",
                    "1.2.643.100.5": "Состав имени субъекта:\nOGRNIP\nОГРНИП (15 символов). ОГРНИП (только для ИП).\n\nМожет быть  использовано только в одном экземпляре",
                    "1.2.643.2.2.34.6": "Пользователь Центра Регистрации, HTTP, TLS client – формирование электронной цифровой подписи электронных документов, определенных Регламентом для Пользователя Удостоверяющего центра.",
                    "1.2.643.3.131.1.1": "Состав имени субъекта:\nINN\nЮЛ/ИП: ИНН (12 символов)\nФЛ: Не обязательно, но строго рекомендуется к включению для целей взаимодействия с ФНС.\n\n\nСостав имени издателя СКПЭП:\nINN\nИНН (12 символов), ИНН Организации.\n\nМожет быть  использовано только в одном экземпляре",

                    "2.5.4.3": "Состав имени субъекта\nCN\nОбщее имя (64 символа)\nЮЛ: В зависимости от типа конечного владельца СКПЭП:\n - наименование организации;\n - ФИО должностного лица;\n - название автоматизированной системы;\n - другое отображаемое имя по требованиям информационной системы.\nФЛ: ФИО\n\nСостав имени издателя СКПЭП:\nОбщее имя, 64 символа max, Псевдоним удостоверяющего центра.\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.4": "Состав имени субъекта:\nsurname\nФамилия физического лица (128 символов)",
                    "2.5.4.5": "serialNumber\nПоле serialNumber (серийный номер) должно содержать положительное целое число, однозначно идентифицирующее квалифицированный сертификат в множестве всех сертификатов, выданных данным аккредитованным Удостоверяющим центром, доверенным лицом аккредитованного Удостоверяющего центра либо уполномоченным федеральным органом.",
                    "2.5.4.6": "Состав имени субъекта:\nC\nСтрана (2 символа). Код страны согласно ГОСТ 7.67-2003 (ИСО 3166-1:1997)\n\nСостав имени издателя СКПЭП:\n(2 символа). Код страны согласно ГОСТ 7.67-2003 (ИСО 3166-1:1997)\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.7": "Состав имени субъекта:\nL\nНаселенный пункт (128 символов). Наименование населенного пункта:\nЮЛ: По адресу местонахождения\nФЛ: По адресу регистрации\n\nСостав имени издателя СКПЭП:\nL\n, Населенный пункт (128 символов). Наименование населенного пункта местонахождения ПАК УЦ.\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.8": "Состав имени субъекта:\nS\nРегион (128 символов). Наименование субъекта РФ:\nЮЛ: По адресу местонахождения\nФЛ: По адресу регистрации\n\nСостав имени издателя СКПЭП:\nS\nРегион (128 символов). Наименование субъекта РФ местонахождения ПАК УЦ\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.9": "Состав имени субъекта:\nstreetAddress\nНазвание улицы,номер дома (128 символов)\nВ качестве значения данного атрибута имени следует использовать текстовую строку, содержащую часть адреса места нахождения соответствующего лица, включающую наименование улицы, номер дома, а также корпуса, строения, квартиры, помещения (если имеется).",
                    "2.5.4.10": "Состав имени субъекта:\nO\nОрганизация (64 символа). Полное или сокращенное наименование организации (только для ЮЛ).\n\nСостав имени издателя СКПЭП:\nO\nОрганизация (64 символа). Полное или сокращенное наименование организации\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.11": "Состав имени субъекта:\nOU\nПодразделение (64 символа)\nЮЛ: В случае выпуска СКПЭП на должностное лицо – соответствующее подразделение организации\n\nСостав имени издателя СКПЭП:\nOU\nПодразделение (64 символа). В случае выпуска СКПЭП на должностное лицо – соответствующее подразделение организации\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.12": "Состав имени субъекта:\nT\nДолжность (64 символа)\nЮЛ: В случае выпуска СКПЭП на должностное лицо – его должность.\n\nМожет быть  использовано только в одном экземпляре",
                    "2.5.4.33": "Role occupant attribute type. Например, 'Водитель грузовика'",
                    "2.5.4.42": "Состав имени субъекта:\ngivenName\nИмя Отчество (128 символов). ИО указывается только если имеется.",
                    //"2.5.4.16": "Состав имени субъекта:\n\n\n\nСостав имени издателя СКПЭП:\nS\n",
                    
                    "2.16.840.1.113730.1.1": "Netscape certificate type\nAn X.509 v3 certificate extension used to identify whether\nthe certificate subject is an SSL client, an SSL server, or a CA.",
                    "2.16.840.1.113730.1.13": "Netscape certificate comment\nAn X.509 v3 certificate extension used to include free-form\ntext comments inside certificates.",
                    
                    "2.5.29.14": "Идентификатор ключа субъекта",
                    "2.5.29.15": "Key Usage, область использования ключа. digitalSignature(0), nonRepudiation(1), keyEncipherment(2), dataEncipherment(3), keyAgreement(4), keyCertSign(5), cRLSign(6)", // http://www.alvestrand.no/objectid/2.5.29.15.html
                    "2.5.29.16": "Private key usage period, Период использования закрытого ключа",
                    "2.5.29.17": "Альтернативные Имена Субъекта. This extension contains one or more alternative names, using any of a variety of name forms, for the entity that is bound by the CA to the certified public key", // http://tools.ietf.org/html/rfc3280.html#section-4.2.1.7
                    "2.5.29.19": "Basic constraints. Основные ограничения.\nSybjectType (Тип владельца сертификата) =CA\nPath Length Constraint (Ограничение на длину пути – ограничивает количество уровней иерархии при создании подчиненных Удостоверяющих центров)= None - Отсутствует. \n\nВ переводе: Тип субъекта=ЦС, Ограничение на длину пути=Отсутствует.", // http://shkolnie.ru/pravo/18004/index.html?page=9
                    "2.5.29.31": "CDP, точки распространения списков отзыва",
                    "2.5.29.32": "Certificate Policies, политики сертификата, в соответствии с которыми должен использоваться квалифицированный сертификат.",
                    "2.5.29.35": "AuthorityKeyIdentifier, [Идентификатор ключа РУЦ АО],[Идентификатор ключа центра сертификатов] ",
                    "2.5.29.37": "ExtendedKeyUsage, расширенное использования ключа. Состав дополнения зависит от информационной системы, в которой используется СКПЭП.",
                    "2.5.29.37.0": "Any extended key usage", 
           
                    // Поля сертификата ключа подписи:                  http://link-service.ru/uc/oid/index.php?option=com_content&view=article&id=177&Itemid=75
                    //"1.2.643.3.131.1.1": "INN  (ИНН) (12 символов), ИНН организации. [Поля сертификата ключа подписи]",
                    
                    // Объектные идентификаторы политики сертификата:   http://link-service.ru/uc/oid/index.php?option=com_content&view=article&id=177&Itemid=75
                    // Координирующая организация
                    "1.2.643.3.131": "ГНИВЦ. [Объектные идентификаторы политики сертификата][Координирующая организация]",
                    "1.2.643.3.131.1045": "ООО Линк-сервис. [Объектные идентификаторы политики сертификата][Координирующая организация]",
                    
                    // 1.2.643.2.2 Открытые ключи, идентификация ПО компании "КриптоПро": http://ank-pki.ru/doc/oid%20IS.htm
                    
                    "1.2.643.2.2.3": "ГОСТ R 34.11/34.10-2001, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.4": "ГОСТ R 34.11/34.10-94, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.9": "ГОСТ R 34.11-94, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.19": "ГОСТ R 34.10-2001, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.20": "ГОСТ R 34.10-94, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.21": "ГОСТ 28147-89, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.98": "ГОСТ R 34.10-2001 DH, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    "1.2.643.2.2.99": "ГОСТ R 34.10-94 DH, [Открытые ключи, идентификация ПО компании 'КриптоПро']",
                    
                    "1.2.840.113549.1.1": "Public Key Cryptosystem One defined by RSA Inc", // http://www.alvestrand.no/objectid/1.2.840.113549.1.1.html
                    "1.2.840.113549.1.1.1": "RSA encryption\nRSA (PKCS #1 v1.5) key transport algorithm",
                    "1.2.840.113549.1.1.2": "MD2 with RSA encryption\nIdentifier for MD2 checksum with RSA encryption for use with Public Key Cryptosystem One defined by RSA Inc. ",
                    "1.2.840.113549.1.1.3": "iso(1) member-body(2) US(840) rsadsi(113549) pkcs(1) md4WithRSAEncryption(3)\nPKCS #1 md4withRSAEncryption ",
                    "1.2.840.113549.1.1.4": "MD5 with RSA encryption\nIdentifier for MD5 checksum with RSA encryption for use with Public Key Cryptosystem One defined by RSA Inc.",
                    "1.2.840.113549.1.1.5": "SHA-1 with RSA Encryption\nRSA (PKCS #1 v1.5) with SHA-1 signature ",
                    "1.2.840.113549.1.1.6": "rsaOAEPEncryptionSET\nRSA Optimal Asymmetric Encryption Padding (OAEP) encryption set. ",
                    "1.2.840.113549.1.1.7": "id-RSAES-OAEP",
                    "1.2.840.113549.1.1.10": "RSASSA-PSS\nRSA Signature Scheme with Appendix - Probabilistic Signature Scheme (RSASSA-PSS) ",
                    "1.2.840.113549.1.1.11": "sha256WithRSAEncryption\nSHA256 with RSA Encryption",
                    
                    "1.3.6.1.5.5.7.1.1": "Доступ к информации о центрах сертификации ([Ниже/в подчинении к этому элементу] должен быть указан метод доступа)",
                    "1.3.6.1.5.5.7.48.1": "Метод Доступа к информации о центрах сертификации: Access Method=On-line Certificate Status Protocol (OCSP)", //http://social.technet.microsoft.com/Forums/en-US/2f0bbf0f-153b-480a-b6d7-744b853f3bc2/access-methodcertification-authority-issuer-issuing-ca-cert-path-why-necessary-?forum=winserversecurity
                    "1.3.6.1.5.5.7.48.2": "Метод Доступа к информации о центрах сертификации: Access Method=Certification Authority Issuer (CAI)", //http://social.technet.microsoft.com/Forums/en-US/2f0bbf0f-153b-480a-b6d7-744b853f3bc2/access-methodcertification-authority-issuer-issuing-ca-cert-path-why-necessary-?forum=winserversecurity
                    
                    // Список объектных идентификаторов OID обслуживаемых информационных систем, Международные http://ank-pki.ru/doc/oid%20IS.htm
                    "1.3.6.1.5.5.7.3.1": "Аутентификация сервера, Проверка подлинности сервера",
                    "1.3.6.1.5.5.7.3.2": "Аутентификация клиента, Проверка подлинности клиента",
                    "1.3.6.1.5.5.7.3.3": "Подписывание кода",
                    "1.3.6.1.5.5.7.3.4": "Защищенная электронная почта",
                    "1.3.6.1.5.5.7.3.8": "Простановка штампов времени",
                    "1.3.6.1.4.1.311.10.5.1": "Цифровые права",
                    "1.3.6.1.4.1.311.10.3.12": "Подписывание документа",

                    // PKCS-9 - Signatures: http://www.alvestrand.no/objectid/1.2.840.113549.1.9.html
                    
                    "1.2.840.113549.1.9.1": "e-mailAddress [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.2": "PKCS-9 unstructuredName [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.3": "contentType [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.4": "messageDigest [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.5": "Signing Time [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.7": "Challenge Password [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.8": "PKCS-9 unstructuredAddress [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.13": "Signing Description [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.14": "PKCS#9 ExtensionRequest [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.15": "S/Mime capabilities [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.16": "S/MIME Object Identifier Registry [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.20": "PKCS-9 Attribute : friendlyName [PKCS-9 - Signatures]",
                    "1.2.840.113549.1.9.22": "certTypes  [PKCS-9 - Signatures]",

                    // http://cpdn.cryptopro.ru/content/csp36/html/group___pro_c_s_p_ex_CP_PARAM_OIDS.html
                    "1.2.643.2.2.30.0": "szOID_GostR3411_94_TestParamSet\nТестовый узел замены",
                    "1.2.643.2.2.30.1": "szOID_GostR3411_94_CryptoProParamSet\nУзел замены функции хэширования по умолчанию, вариант 'Верба-О'",
                    "1.2.643.2.2.30.2": "szOID_GostR3411_94_CryptoPro_B_ParamSet\nУзел замены функции хэширования, вариант 1",
                    "1.2.643.2.2.30.3": "szOID_GostR3411_94_CryptoPro_C_ParamSet\nУзел замены функции хэширования, вариант 2",
                    "1.2.643.2.2.30.4": "szOID_GostR3411_94_CryptoPro_D_ParamSet\nУзел замены функции хэширования, вариант 3",
                    "1.2.643.2.2.31.0": "szOID_Gost28147_89_TestParamSet\nТестовый узел замены алгоритма шифрования",
                    "1.2.643.2.2.31.1": "szOID_Gost28147_89_CryptoPro_A_ParamSet\nУзел замены алгоритма шифрования по умолчанию, вариант 'Верба-О'",
                    "1.2.643.2.2.31.2": "szOID_Gost28147_89_CryptoPro_B_ParamSet\nУзел замены алгоритма шифрования,вариант 1",
                    "1.2.643.2.2.31.3": "szOID_Gost28147_89_CryptoPro_C_ParamSet\nУзел замены алгоритма шифрования,вариант 2",
                    "1.2.643.2.2.31.4": "szOID_Gost28147_89_CryptoPro_D_ParamSet\nУзел замены алгоритма шифрования,вариант 3",
                    "1.2.643.2.2.31.5": "szOID_Gost28147_89_CryptoPro_Oscar_1_1_ParamSet\n Узел замены, вариант карты КриптоРИК",
                    "1.2.643.2.2.31.6": "szOID_Gost28147_89_CryptoPro_Oscar_1_0_ParamSet\n Узел замены, используемый при шифровании с хэшированием",
                    "1.2.643.2.2.32.2": "szOID_GostR3410_94_CryptoPro_A_ParamSet\nПараметры P,Q,A цифровой подписи ГОСТ Р 34.10-94, вариант 'Верба-О'. Могут использоваться также в алгоритме Диффи-Хеллмана",
                    "1.2.643.2.2.32.3": "szOID_GostR3410_94_CryptoPro_B_ParamSet\nПараметры P,Q,A цифровой подписи ГОСТ Р 34.10-94, вариант 1. Могут использоваться также в алгоритме Диффи-Хеллмана",
                    "1.2.643.2.2.32.4": "szOID_GostR3410_94_CryptoPro_C_ParamSet\nПараметры P,Q,A цифровой подписи ГОСТ Р 34.10-94, вариант 2. Могут использоваться также в алгоритме Диффи-Хеллмана",
                    "1.2.643.2.2.32.5": "szOID_GostR3410_94_CryptoPro_D_ParamSet\nПараметры P,Q,A цифровой подписи ГОСТ Р 34.10-94, вариант 3. Могут использоваться также 2 алгоритме Диффи-Хеллмана",
                    "1.2.643.2.2.33.1": "szOID_GostR3410_94_CryptoPro_XchA_ParamSet\n Параметры P,Q,A алгоритма Диффи-Хеллмана на базе экспоненциальной функции, вариант 1",
                    "1.2.643.2.2.33.2": "szOID_GostR3410_94_CryptoPro_XchB_ParamSet\n Параметры P,Q,A алгоритма Диффи-Хеллмана на базе экспоненциальной функции, вариант 2",
                    "1.2.643.2.2.33.3": "szOID_GostR3410_94_CryptoPro_XchC_ParamSet\n Параметры P,Q,A алгоритма Диффи-Хеллмана на базе экспоненциальной функции, вариант 3",
                    "1.2.643.2.2.35.0": "szOID_GostR3410_2001_TestParamSet\nТестовые параметры a, b, p,q, (x,y) алгоритма ГОСТ Р 34.10-2001",
                    "1.2.643.2.2.35.1": "szOID_GostR3410_2001_CryptoPro_A_ParamSet\nПараметры a, b, p,q, (x,y) цифровой подписи и алгоритма Диффи-Хеллмана на базе алгоритма ГОСТ Р 34.10-2001, вариант криптопровайдера",
                    "1.2.643.2.2.35.2": "szOID_GostR3410_2001_CryptoPro_B_ParamSet\nПараметры a, b, p,q, (x,y) цифровой подписи и алгоритма Диффи-Хеллмана на базе алгоритма ГОСТ Р 34.10-2001, вариант карты КриптоРИК",
                    "1.2.643.2.2.35.3": "szOID_GostR3410_2001_CryptoPro_C_ParamSet\nПараметры a, b, p,q, (x,y) цифровой подписи и алгоритма Диффи-Хеллмана на базе алгоритма ГОСТ Р 34.10-2001, вариант 1",
                    "1.2.643.2.2.36.0": "szOID_GostR3410_2001_CryptoPro_XchA_ParamSet\nПараметры a, b, p,q, (x,y) алгоритма Диффи-Хеллмана на базе алгоритма ГОСТ Р 34.10-2001, вариант криптопровайдера. Используются те же параметры, что и с идентификатором szOID_GostR3410_2001_CryptoPro_A_ParamSet",
                    "1.2.643.2.2.36.1": "szOID_GostR3410_2001_CryptoPro_XchB_ParamSet\nПараметры a, b, p,q, (x,y) цифровой подписи и алгоритма Диффи-Хеллмана на базе алгоритма ГОСТ Р 34.10-2001, вариант 1 "
                };

var hardLimit = 100,
    ellipsis = "\u2026",
    DOM = {
        tag: function (tagName, className) {
            var t = document.createElement(tagName);
            t.className = className;
            return t;
        },
        text: function (str) {
            return document.createTextNode(str);
        }
    };

function Stream(enc, pos) {
    if (enc instanceof Stream) {
        this.enc = enc.enc;
        this.pos = enc.pos;
    } else {
        this.enc = enc;
        this.pos = pos;
    }
}
Stream.prototype.get = function (pos) {
    if (pos === undefined)
        pos = this.pos++;
    if (pos >= this.enc.length)
        throw 'Requesting byte offset ' + pos + ' on a stream of length ' + this.enc.length;
    return this.enc[pos];
};
Stream.prototype.hexDigits = "0123456789ABCDEF";
Stream.prototype.hexByte = function (b) {
    return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
};
Stream.prototype.hexDump = function (start, end, raw) {
    var s = "";
    for (var i = start; i < end; ++i) {
        s += this.hexByte(this.get(i));
        if (raw !== true)
            switch (i & 0xF) {
            case 0x7: s += "  "; break;
            case 0xF: s += "\n"; break;
            default:  s += " ";
            }
    }
    return s;
};
Stream.prototype.parseStringISO = function (start, end) {
    var s = "";
    for (var i = start; i < end; ++i)
        s += String.fromCharCode(this.get(i));
    return s;
};
Stream.prototype.parseStringUTF = function (start, end) {
    var s = "";
    for (var i = start; i < end; ) {
        var c = this.get(i++);
        if (c < 128)
            s += String.fromCharCode(c);
        else if ((c > 191) && (c < 224))
            s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
        else
            s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
    }
    return s;
};
Stream.prototype.parseStringBMP = function (start, end) {
    var str = ""
    for (var i = start; i < end; i += 2) {
        var high_byte = this.get(i);
        var low_byte = this.get(i + 1);
        str += String.fromCharCode( (high_byte << 8) + low_byte );
    }

    return str;
};
Stream.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
Stream.prototype.parseTime = function (start, end) {
    var s = this.parseStringISO(start, end),
        m = this.reTime.exec(s);
    if (!m)
        return "Unrecognized time: " + s;
    s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
    if (m[5]) {
        s += ":" + m[5];
        if (m[6]) {
            s += ":" + m[6];
            if (m[7])
                s += "." + m[7];
        }
    }
    if (m[8]) {
        s += " UTC";
        if (m[8] != 'Z') {
            s += m[8];
            if (m[9])
                s += ":" + m[9];
        }
    }
    return s;
};
Stream.prototype.parseInteger = function (start, end) {
    //TODO support negative numbers
    var len = end - start;
    if (len > 4) {
        len <<= 3;
        var s = this.get(start);
        if (s === 0)
            len -= 8;
        else
            while (s < 128) {
                s <<= 1;
                --len;
            }
        return "(" + len + " bit)";
    }
    var n = 0;
    for (var i = start; i < end; ++i)
        n = (n << 8) | this.get(i);
    return n;
};
Stream.prototype.parseBitString = function (start, end) {
    var unusedBit = this.get(start),
        lenBit = ((end - start - 1) << 3) - unusedBit,
        s = "(" + lenBit + " bit)";
    if (lenBit <= 20) {
        var skip = unusedBit;
        s += " ";
        for (var i = end - 1; i > start; --i) {
            var b = this.get(i);
            for (var j = skip; j < 8; ++j)
                s += (b >> j) & 1 ? "1" : "0";
            skip = 0;
        }
    }
    return s;
};
Stream.prototype.parseOctetString = function (start, end) {
    var len = end - start,
        s = "(" + len + " byte) ";
    if (len > hardLimit)
        end = start + hardLimit;
    for (var i = start; i < end; ++i)
        s += this.hexByte(this.get(i)); //TODO: also try Latin1?
    if (len > hardLimit)
        s += ellipsis;
    return s;
};
Stream.prototype.parseOID = function (start, end) {
    var s = '',
        n = 0,
        bits = 0;
    for (var i = start; i < end; ++i) {
        var v = this.get(i);
        n = (n << 7) | (v & 0x7F);
        bits += 7;
        if (!(v & 0x80)) { // finished
            if (s === '') {
                var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                s = m + "." + (n - m * 40);
            } else
                s += "." + ((bits >= 31) ? "bigint" : n);
            n = bits = 0;
        }
    }
    return s;
};

function ASN1(stream, header, length, tag, sub) {
    this.stream = stream;
    this.header = header;
    this.length = length;
    this.tag = tag;
    this.sub = sub;
}
ASN1.prototype.typeName = function () {
    if (this.tag === undefined)
        return "unknown";
    var tagClass = this.tag >> 6,
        tagConstructed = (this.tag >> 5) & 1,
        tagNumber = this.tag & 0x1F;
    switch (tagClass) {
    case 0: // universal
        switch (tagNumber) {
        case 0x00: return "EOC";
        case 0x01: return "BOOLEAN";
        case 0x02: return "INTEGER";
        case 0x03: return "BIT_STRING";
        case 0x04: return "OCTET_STRING";
        case 0x05: return "NULL";
        case 0x06: return "OBJECT_IDENTIFIER";
        case 0x07: return "ObjectDescriptor";
        case 0x08: return "EXTERNAL";
        case 0x09: return "REAL";
        case 0x0A: return "ENUMERATED";
        case 0x0B: return "EMBEDDED_PDV";
        case 0x0C: return "UTF8String";
        case 0x10: return "SEQUENCE";
        case 0x11: return "SET";
        case 0x12: return "NumericString";
        case 0x13: return "PrintableString"; // ASCII subset
        case 0x14: return "TeletexString"; // aka T61String
        case 0x15: return "VideotexString";
        case 0x16: return "IA5String"; // ASCII
        case 0x17: return "UTCTime";
        case 0x18: return "GeneralizedTime";
        case 0x19: return "GraphicString";
        case 0x1A: return "VisibleString"; // ASCII subset
        case 0x1B: return "GeneralString";
        case 0x1C: return "UniversalString";
        case 0x1E: return "BMPString";
        default:   return "Universal_" + tagNumber.toString(16);
        }
    case 1: return "Application_" + tagNumber.toString(16);
    case 2: return "[" + tagNumber + "]"; // Context
    case 3: return "Private_" + tagNumber.toString(16);
    }
};
ASN1.prototype.reSeemsASCII = /^[ -~]+$/;
ASN1.prototype.content = function () {
    if (this.tag === undefined)
        return null;
    var tagClass = this.tag >> 6,
        tagNumber = this.tag & 0x1F,
        content = this.posContent(),
        len = Math.abs(this.length);
    if (tagClass !== 0) { // universal
        if (this.sub !== null)
            return "(" + this.sub.length + " elem)";
        //TODO: TRY TO PARSE ASCII STRING
        var s = this.stream.parseStringISO(content, content + Math.min(len, hardLimit));
        if (this.reSeemsASCII.test(s))
            return s.substring(0, 2 * hardLimit) + ((s.length > 2 * hardLimit) ? ellipsis : "");
        else
            return this.stream.parseOctetString(content, content + len);
    }
    switch (tagNumber) {
    case 0x01: // BOOLEAN
        return (this.stream.get(content) === 0) ? "false" : "true";
    case 0x02: // INTEGER
        return this.stream.parseInteger(content, content + len);
    case 0x03: // BIT_STRING
        return this.sub ? "(" + this.sub.length + " elem)" :
            this.stream.parseBitString(content, content + len);
    case 0x04: // OCTET_STRING
        return this.sub ? "(" + this.sub.length + " elem)" :
            this.stream.parseOctetString(content, content + len);
    //case 0x05: // NULL
    case 0x06: // OBJECT_IDENTIFIER
            var oid = this.stream.parseOID(content, content + len); 
        //return "<a class=\"oid\" href=\"http://www.alvestrand.no/objectid/"+oid+".html\">"+oid+"</a>";
       return "<a href=\"http://www.oid-info.com/get/"+oid+"\" target=\"_blank\""+(typeof arrOids[oid] == 'undefined' ? "" : " class=\"titled\" title=\""+arrOids[oid]+"\"")+">"+oid+"</a>";
 
    //case 0x07: // ObjectDescriptor
    //case 0x08: // EXTERNAL
    //case 0x09: // REAL
    //case 0x0A: // ENUMERATED
    //case 0x0B: // EMBEDDED_PDV
    case 0x10: // SEQUENCE
    case 0x11: // SET
        return "(" + this.sub.length + " elem)";
    case 0x0C: // UTF8String
        return this.stream.parseStringUTF(content, content + len);
    case 0x12: // NumericString
    case 0x13: // PrintableString
    case 0x14: // TeletexString
    case 0x15: // VideotexString
    case 0x16: // IA5String
    //case 0x19: // GraphicString
    case 0x1A: // VisibleString
    //case 0x1B: // GeneralString
    //case 0x1C: // UniversalString
        return this.stream.parseStringISO(content, content + len);
    case 0x1E: // BMPString
        return this.stream.parseStringBMP(content, content + len);
    case 0x17: // UTCTime
    case 0x18: // GeneralizedTime
        return this.stream.parseTime(content, content + len);
    }
    return null;
};
ASN1.prototype.toString = function () {
    return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? 'null' : this.sub.length) + "]";
};
ASN1.prototype.print = function (indent) {
    if (indent === undefined) indent = '';
    document.writeln(indent + this);
    if (this.sub !== null) {
        indent += '  ';
        for (var i = 0, max = this.sub.length; i < max; ++i)
            this.sub[i].print(indent);
    }
};
ASN1.prototype.toPrettyString = function (indent) {
    if (indent === undefined) indent = '';
    var s = indent + this.typeName() + " @" + this.stream.pos;
    if (this.length >= 0)
        s += "+";
    s += this.length;
    if (this.tag & 0x20)
        s += " (constructed)";
    else if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub !== null))
        s += " (encapsulates)";
    s += "\n";
    if (this.sub !== null) {
        indent += '  ';
        for (var i = 0, max = this.sub.length; i < max; ++i)
            s += this.sub[i].toPrettyString(indent);
    }
    return s;
};
ASN1.prototype.toDOM = function () {
    var node = DOM.tag("div", "node");
    node.asn1 = this;
    var head = DOM.tag("div", "head");
    var s = this.typeName().replace(/_/g, " ");
    head.innerHTML = s;
    var content = this.content();
    if (content !== null) {
        if( String(content).search(/\<(?:a|\/a)/g)>-1 )
        {
            content = String(content).replace(/\<(?!(a)|(\/a))/g, "&lt;");
            var preview = DOM.tag("span", "preview");
            preview.innerHTML = content;
            head.appendChild(preview);
        }
        else
        {
            content = String(content).replace(/\<(?!(a)|(\/a))/g, "&lt;");
            var preview = DOM.tag("span", "preview");
            preview.appendChild(DOM.text(content));
            head.appendChild(preview);
        }
    }
    node.appendChild(head);
    this.node = node;
    this.head = head;
    var value = DOM.tag("div", "value");
    s = "Offset: " + this.stream.pos + "<br/>";
    s += "Length: " + this.header + "+";
    if (this.length >= 0)
        s += this.length;
    else
        s += (-this.length) + " (undefined)";
    if (this.tag & 0x20)
        s += "<br/>(constructed)";
    else if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub !== null))
        s += "<br/>(encapsulates)";
    //TODO if (this.tag == 0x03) s += "Unused bits: "
    if (content !== null) {
        s += "<br/>Value:<br/><b>" + content + "</b>";
        if ((typeof oids === 'object') && (this.tag == 0x06)) {
            var oid = oids[content];
            if (oid) {
                if (oid.d) s += "<br/>" + oid.d;
                if (oid.c) s += "<br/>" + oid.c;
                if (oid.w) s += "<br/>(warning!)";
            }
        }
    }
    value.innerHTML = s;
    node.appendChild(value);
    var sub = DOM.tag("div", "sub");
    if (this.sub !== null) {
        for (var i = 0, max = this.sub.length; i < max; ++i)
            sub.appendChild(this.sub[i].toDOM());
    }
    node.appendChild(sub);
    head.onclick = function () {
        node.className = (node.className == "node collapsed") ? "node" : "node collapsed";
    };
    return node;
};
ASN1.prototype.posStart = function () {
    return this.stream.pos;
};
ASN1.prototype.posContent = function () {
    return this.stream.pos + this.header;
};
ASN1.prototype.posEnd = function () {
    return this.stream.pos + this.header + Math.abs(this.length);
};
ASN1.prototype.fakeHover = function (current) {
    this.node.className += " hover";
    if (current)
        this.head.className += " hover";
};
ASN1.prototype.fakeOut = function (current) {
    var re = / ?hover/;
    this.node.className = this.node.className.replace(re, "");
    if (current)
        this.head.className = this.head.className.replace(re, "");
};
ASN1.prototype.toHexDOM_sub = function (node, className, stream, start, end) {
    if (start >= end)
        return;
    var sub = DOM.tag("span", className);
    sub.appendChild(DOM.text(
        stream.hexDump(start, end)));
    node.appendChild(sub);
};
ASN1.prototype.toHexDOM = function (root) {
    var node = DOM.tag("span", "hex");
    if (root === undefined) root = node;
    this.head.hexNode = node;
    this.head.onmouseover = function () { this.hexNode.className = "hexCurrent"; };
    this.head.onmouseout  = function () { this.hexNode.className = "hex"; };
    node.asn1 = this;
    node.onmouseover = function () {
        var current = !root.selected;
        if (current) {
            root.selected = this.asn1;
            this.className = "hexCurrent";
        }
        this.asn1.fakeHover(current);
    };
    node.onmouseout  = function () {
        var current = (root.selected == this.asn1);
        this.asn1.fakeOut(current);
        if (current) {
            root.selected = null;
            this.className = "hex";
        }
    };
    this.toHexDOM_sub(node, "tag", this.stream, this.posStart(), this.posStart() + 1);
    this.toHexDOM_sub(node, (this.length >= 0) ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent());
    if (this.sub === null)
        node.appendChild(DOM.text(
            this.stream.hexDump(this.posContent(), this.posEnd())));
    else if (this.sub.length > 0) {
        var first = this.sub[0];
        var last = this.sub[this.sub.length - 1];
        this.toHexDOM_sub(node, "intro", this.stream, this.posContent(), first.posStart());
        for (var i = 0, max = this.sub.length; i < max; ++i)
            node.appendChild(this.sub[i].toHexDOM(root));
        this.toHexDOM_sub(node, "outro", this.stream, last.posEnd(), this.posEnd());
    }
    return node;
};
ASN1.prototype.toHexString = function (root) {
    return this.stream.hexDump(this.posStart(), this.posEnd(), true);
};
ASN1.decodeLength = function (stream) {
    var buf = stream.get(),
        len = buf & 0x7F;
    if (len == buf)
        return len;
    if (len > 3)
        throw "Length over 24 bits not supported at position " + (stream.pos - 1);
    if (len === 0)
        return -1; // undefined
    buf = 0;
    for (var i = 0; i < len; ++i)
        buf = (buf << 8) | stream.get();
    return buf;
};
ASN1.hasContent = function (tag, len, stream) {
    if (tag & 0x20) // constructed
        return true;
    if ((tag < 0x03) || (tag > 0x04))
        return false;
    var p = new Stream(stream);
    if (tag == 0x03) p.get(); // BitString unused bits, must be in [0, 7]
    var subTag = p.get();
    if ((subTag >> 6) & 0x01) // not (universal or context)
        return false;
    try {
        var subLength = ASN1.decodeLength(p);
        return ((p.pos - stream.pos) + subLength == len);
    } catch (exception) {
        return false;
    }
};
ASN1.decode = function (stream) {
    if (!(stream instanceof Stream))
        stream = new Stream(stream, 0);
    var streamStart = new Stream(stream),
        tag = stream.get(),
        len = ASN1.decodeLength(stream),
        header = stream.pos - streamStart.pos,
        sub = null;
    if (ASN1.hasContent(tag, len, stream)) {
        // it has content, so we decode it
        var start = stream.pos;
        if (tag == 0x03) stream.get(); // skip BitString unused bits, must be in [0, 7]
        sub = [];
        if (len >= 0) {
            // definite length
            var end = start + len;
            while (stream.pos < end)
                sub[sub.length] = ASN1.decode(stream);
            if (stream.pos != end)
                throw "Content size is not correct for container starting at offset " + start;
        } else {
            // undefined length
            try {
                for (;;) {
                    var s = ASN1.decode(stream);
                    if (s.tag === 0)
                        break;
                    sub[sub.length] = s;
                }
                len = start - stream.pos;
            } catch (e) {
                throw "Exception while decoding undefined length content: " + e;
            }
        }
    } else
        stream.pos += len; // skip content
    return new ASN1(streamStart, header, len, tag, sub);
};
ASN1.test = function () {
    var test = [
        { value: [0x27],                   expected: 0x27     },
        { value: [0x81, 0xC9],             expected: 0xC9     },
        { value: [0x83, 0xFE, 0xDC, 0xBA], expected: 0xFEDCBA }
    ];
    for (var i = 0, max = test.length; i < max; ++i) {
        var pos = 0,
            stream = new Stream(test[i].value, 0),
            res = ASN1.decodeLength(stream);
        if (res != test[i].expected)
            document.write("In test[" + i + "] expected " + test[i].expected + " got " + res + "\n");
    }
};

// export globals
window.ASN1 = ASN1;
})();
