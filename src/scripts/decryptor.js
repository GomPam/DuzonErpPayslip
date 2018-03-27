// Using cryptoJS Library - https://github.com/tomyun/crypto-js
// Example: http://cris.joongbu.ac.kr/course/2016-1/wp1/crypto/cryptoJS.html

// Capicom RC2-CBC Decrypt Reference - Jeong ChanWoo
// https://github.com/enghqii/PayPaperDecrypter

// Defines
const EncHex = CryptoJS.enc.Hex;
const EncBase64 = CryptoJS.enc.Base64;

const EncUtf8 = CryptoJS.enc.Utf8;
const EncUtf16LE = CryptoJS.enc.Utf16LE;

var Decryptor = {
    // Capicom RC2-CBC
    // IV = 8 Bytes
    // Salt = 16 Bytes

    // (StartByte, EndBytes)
    // IV => (56 + 2, 56 + 2 + 8)
    // Salt => (66 + 2, 66 + 2 + 16)
    // Content => (84 + 4, EncryptedData End)

    ByteLength: {
        IV: 8,
        Salt: 16,
        Key: 16,
        Content: -1
    },

    BytePosition: {
        IV: 56 + 2,
        Salt: 66 + 2,
        Key: 0,
        Content: 84 + 4
    },

    Slicer: function(Data, Type) {
        // Hexadecimal String Length is Double
        // so. slice param value is double
        var StartPos = this.BytePosition[Type] * 2;
        var EndPos = StartPos + this.ByteLength[Type] * 2;

        if (Type == 'Content')
            EndPos = Data.length;

        return Data.slice(StartPos, EndPos);
    },

    DecryptKey: function(Data, InputedKey) {
        var Key = EncUtf16LE.parse(InputedKey);
        var Salt = EncHex.parse(this.Slicer(Data, 'Salt'));

        var Hash_SHA1 = CryptoJS.algo.SHA1.create();

        Hash_SHA1.update(Key);
        Hash_SHA1.update(Salt);

        var HashResult = Hash_SHA1.finalize().toString(EncHex);

        return EncHex.parse(this.Slicer(HashResult, 'Key'));
    },

    DecryptLegacy: function(InputedKey, EncryptedData) {
        var Target = EncBase64.parse(EncryptedData).toString(EncHex);
        var Key = this.DecryptKey(Target, InputedKey);

        var IV = EncHex.parse(this.Slicer(Target, 'IV'));
        var Content = EncHex.parse(this.Slicer(Target, 'Content'));

        var DecryptedData = CryptoJS.RC2.decrypt(
            { ciphertext: Content },
            Key,
            { iv: IV, mode: CryptoJS.mode.CBC, effectiveKeyBits: 128 }
        );

        var HtmlData = EncUtf16LE.stringify(DecryptedData);
        return HtmlData;
    },

    DecryptNew: function(InputedKey, EncryptedData) {
        var HtmlData = '';
        var BinaryData = unescape(EncryptedData).split(',');
        BinaryData.forEach(
            function(BinaryStr, Idx, DataArray) {
                HtmlData += String.fromCharCode(Number(BinaryStr) + InputedKey.charCodeAt(Idx % InputedKey.length));
            }
        );

        return HtmlData;
    },

    Decrypt: function(InputedKey, EncryptedData) {
        // For New Decryptor
        if (EncryptedData.indexOf('%') != -1) {
            return this.DecryptNew(InputedKey, EncryptedData);
        }
        // For Legacy
        else {
            return this.DecryptLegacy(InputedKey, EncryptedData);
        }
    }
}
