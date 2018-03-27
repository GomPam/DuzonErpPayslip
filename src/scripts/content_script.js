function EventBinding() {
    // Password Input
    InputPwd.on(
        'keypress',
        function (evt) {
            // Enter == 13
            if (evt.keyCode == 13)
                return ViewPayPaper();
        }
    );
    InputPwd.on(
        'keyup',
        function (evt) {
            if (this.value.length == this.maxLength)
                return ViewPayPaper();
        }
    );

    // Confirm Button
    $('a:has(img)').on(
        'click',
        function (evt) {
            return ViewPayPaper();
        }
    );
}

function ViewPayPaper() {
    if (PayPaper.Password().length != InputPwd.get(0).maxLength) {
        ErrorAlert(0, PayPaper.Password().length + '/' + InputPwd.get(0).maxLength);
    }
    else {
        try {
            var HtmlData = Decryptor.Decrypt(PayPaper.Password(), PayPaper.Data());
            if (HtmlData.search(/html/) > -1) {
                document.write(HtmlData);
            }
            else {
                throw "Decrypting Error";
            }
        }
        catch(e) {
            ErrorAlert(1, e);
        }
    }

    // Event 전파 방지
    return false;
}

function ErrorAlert(err, msg_text) {
    PayPaper.PasswordReset();
    alert('비밀번호가 올바르지 않습니다. (err: ' + err + ') - [' + msg_text + ']');
}

if (PayPaper.IsVaild()) {
    // KeyEvent, ButtonClick Event Bind
    EventBinding();
}
