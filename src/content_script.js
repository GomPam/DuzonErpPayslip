// Defs
const EncHex = CryptoJS.enc.Hex;
const EncBase64 = CryptoJS.enc.Base64;

const EncUtf8 = CryptoJS.enc.Utf8;
const EncUtf16LE = CryptoJS.enc.Utf16LE;

// 급여명세서의 Capicom 오브젝트의 ClassId 를 가져와서 비교함.
// 혹시 몰라서 ViewPayPaper 함수 존재 여부도 검사함.
function is_paypaper() {
    var crypto_object = document.getElementById('capicom');
    if (crypto_object === null) {
        return false;
    }

    var object_cls = crypto_object.getAttribute('classid');
    if (object_cls === null) {
        return false;
    }

    var paypaper_cls = 'CLSID:A440BD76-CFE1-4D46-AB1F-15F238437A3D';
    if (object_cls.toUpperCase() != paypaper_cls.toUpperCase()) {
        return false;
    }

    var page_html = document.head.innerHTML + document.body.innerHTML;
    if (page_html.search(/ViewPayPaper/) < 0) {
        return false;
    }

    return true;
}

// 자식 엘리멘트 이터레이트 반복이 많아서 함수화 시킴
function foreach_childElement(parentId, childTagName, looping_callback) {
    var child_element = document.getElementById(parentId).getElementsByTagName(childTagName);
    for (var idx = 0; idx < child_element.length; idx++) {
        var _element = child_element[idx];
        var flag = looping_callback(_element);
        if (flag) {
            break;
        }
    }
}

// 암호화된 급여명세서의 데이터를 반환
function paypaper_EncryptedData() {
    var EncryptedData = null;
    foreach_childElement('frm', 'input', function(_input) {
        if (_input.name == '_viewData') {
            EncryptedData = _input.defaultValue;
            return true;
        }
    });
    var regex_pattern = /[\r|\n]/g;
    EncryptedData = EncryptedData.replace(regex_pattern, "");
    return EncryptedData;
}

// Input 받은 복호화 키를 반환
function paypaper_DecryptKey() {
    var DecryptKey = null;
    foreach_childElement('frm', 'input', function(_input) {
        if (_input.name == 'pwd') {
            DecryptKey = _input.value;
            return true;
        }
    });
    return DecryptKey;
}

// http://cris.joongbu.ac.kr/course/2016-1/wp1/crypto/cryptoJS.html
// 찬우님 코드 참조 - https://github.com/enghqii/PayPaperDecrypter
// 급여명세서 복호화!
function decrypt_paypaper() {
    var encryptedData = EncBase64.parse(paypaper_EncryptedData());
    var HexedData = encryptedData.toString(EncHex);

    // Salt = 16 Bytes.
    // Capicom RC2-CBC Salt = (66 + 2, 66 + 2 + 16)
    var Salt = EncHex.parse(HexedData.slice((66 + 2) * 2, (66 + 2 + 16) * 2));

    var Key = paypaper_DecryptKey();
    var DecryptKey = hashed_decryptKey(Key, Salt);

    // IV = 8 Bytes.
    // Capicom RC2-CBC IV = (56 + 2, 56 + 2 + 8)
    var IV = EncHex.parse(HexedData.slice((56 + 2) * 2, (56 + 2 + 8) * 2));

    // Content = After 84 + 4 Bytes To End.
    // Capicom RC2-CBC Content = (84 + 4, DataEndPosition)
    var Content = EncHex.parse(HexedData.slice((84 + 4) * 2, HexedData.length));

    var decryptedData = CryptoJS.RC2.decrypt(
        { ciphertext: Content },
        DecryptKey,
        { iv: IV, mode: CryptoJS.mode.CBC, effectiveKeyBits: 128 }
    );

    var HtmlData = EncUtf16LE.stringify(decryptedData);
    document.write(HtmlData);

    return true;
}

function hashed_decryptKey(Key, Salt) {
    var encKey = EncUtf16LE.parse(Key);

    var algo_sha1 = CryptoJS.algo.SHA1.create();

    algo_sha1.update(encKey);
    algo_sha1.update(Salt);

    var Sha1 = algo_sha1.finalize().toString(EncHex);

    // DecryptKey = 16 Bytes.
    var _Key = EncHex.parse(Sha1.slice(0, 16 * 2));
    return _Key;
}

// 이벤트 바인딩
function event_binding() {
    foreach_childElement('frm', 'input', function(_input) {
        if (_input.name == 'pwd') {
            _input.addEventListener('keypress', function(evt) { if (evt.keyCode == 13) decrypt_paypaper(); });
            _input.addEventListener('keyup', function(evt) { if (this.value.length == 7) decrypt_paypaper(); });
            return true;
        }
    });

    foreach_childElement('frm', 'a', function(_tag_a) {
        if (_tag_a.href.includes('ViewPayPaper')) {
            _tag_a.addEventListener('click', function(evt) { decrypt_paypaper(); });
            return true;
        }
    });
}

if (is_paypaper()) {
    event_binding();
}
