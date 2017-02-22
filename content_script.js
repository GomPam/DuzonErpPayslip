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

// view-source:http://cris.joongbu.ac.kr/course/2016-1/wp1/crypto/cryptoJS.html
// 찬우님 코드 참조 - github.com/enghqii/PayPaperDecrypter
// 급여명세서 복호화!
function decrypt_paypaper() {
    // alert(paypaper_DecryptKey());
    var encryptedData = paypaper_EncryptedData();
    var decryptKey = paypaper_DecryptKey();

    var BlobData = encryptedData.toString(CryptoJS.enc.Base64);

    var _IV = BlobData.slice(56 + 2, 56 + 2 + 8);
    var _Salt = BlobData.slice(66 + 2, 66 + 2 + 16);
    var _Content = BlobData.slice(84 + 4, BlobData.length);

    var _Password = decryptKey.toString(CryptoJS.enc.Utf16LE);

    var algo_sha1 = CryptoJS.algo.SHA256.create();
    algo_sha1.update(_Password);
    algo_sha1.update(_Salt);
    var _Sha1Key = algo_sha1.finalize();

    var _SaltedKey = _Sha1Key.slice(0, 16);


    var algo_rc2 = CryptoJS.RC2.create();

    var decrypted1 = decipher.update(content)
    var decrypted2 = decipher.final()

    var decrypted = Buffer.concat([decrypted1, decrypted2])

    // convert 'decrypted' to utf8 string, from utf-16 Little Endian
    var iconv = new Iconv('UTF-16LE', 'utf-8')
    var decryptedUtf8 = iconv.convert(decrypted).toString()

    return decryptedUtf8
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

// alert(is_paypaper());
if (is_paypaper()) {
    // alert(paypaper_EncryptedData());
    event_binding();
}
