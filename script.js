document.addEventListener('DOMContentLoaded', () => {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.button-next');
    const copyButton = document.querySelector(".button-copy-code");
    const countdownElement = document.querySelector(".remaining-time");
    const countdownWrapper = document.querySelector(".countdown-wrapper");
    const expiredMessage = document.querySelector(".expired-message");
    const countdownTime = document.querySelector(".countdown-time");
    const rebootButton = document.querySelector(".reboot-button");

    let currentStep = 0;
    const countdownMinutes = 20;
    const countdownDuration = countdownMinutes * 60;
    let countdownInterval;

    function initializeCheckedStates() {
        radioInputs.forEach((radio) => {
            if (radio.checked) {
                const label = document.querySelector(`label[for="${radio.id}"]`);
                label.classList.add('checked');
            }
        });
    }

    function handleRadioChange() {
        radioInputs.forEach((radio) => {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            label.classList.remove('checked');
        });

        const checkedLabel = document.querySelector(`label[for="${this.id}"]`);
        checkedLabel.classList.add('checked');
    }

    radioInputs.forEach((input) => {
        input.addEventListener('change', handleRadioChange);
    });

    function startCountdown(duration) {
        countdownTime.textContent =  Math.floor(countdownDuration / 60);;
        let remainingTime = duration;

        countdownElement.textContent = formatTime(remainingTime);

        expiredMessage.style.display = "none";

        if (countdownInterval) {
            clearInterval(countdownInterval);
        } 

        countdownInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                countdownElement.textContent = formatTime(remainingTime);
            } else {
                clearInterval(countdownInterval);
                countdownWrapper.classList.add("expired");
                countdownElement.style.display = "none";
                expiredMessage.style.display = "block";
            }
        }, 1000);
    }
       
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }   

    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('current');
                initializeCheckedStates();
            } else {
                step.classList.remove('current');
            }
        });
    }

    nextButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }

            if (currentStep === steps.length - 1) {
                generateCode();
                startCountdown(countdownDuration);
            }
        });
    });

    function generateCode() {
        const step1Value = document.querySelector('input[name="useSiroko"]:checked').value;
        const lastTwoDigits = step1Value.slice(-2);
        const step1Sum = Array.from(lastTwoDigits).reduce((sum, digit) => sum + parseInt(digit, 10), 0);

        const step2Value = document.querySelector('input[name="forSirokoGlasses"]:checked').value;
        const step2Processed = step2Value.replace(/[ aA]/g, "");
        const step2LastFour = step2Processed.slice(-4);

        const generatedCode = `${step1Sum}${step2LastFour}`;

        const codeElement = document.querySelector(".code");
        codeElement.textContent = generatedCode;
    }

    copyButton.addEventListener("click", (e) => {
        e.preventDefault();
        const codeElement = document.querySelector(".code");
        const codeText = codeElement.textContent;
        const codeCopiedMessage = document.querySelector(".code-copied-message");
        console.log("codeCopiedMessage ", codeCopiedMessage);

        if (codeText) {
            navigator.clipboard
            .writeText(codeText)
            .then(() => {
                console.log("Código copiado al portapapeles: " + codeText);
                codeCopiedMessage.classList.add("active");
                setTimeout(() => {
                    codeCopiedMessage.classList.remove("active");
                  }, "4000");
            })
            .catch((err) => {
                console.error("Error al copiar el código: ", err);
            });
        } else {
            console.error("No hay código para copiar.");
        }
    });

    function resetForm() {
        document.querySelectorAll("input[type='radio']").forEach((input) => {
            input.checked = input.defaultChecked;
            console.log("input.checked ", input.checked);
            if (!input.checked){
                input.parentElement.classList.remove("checked");
            }
        });

        currentStep = 0;
        showStep(currentStep);

        countdownWrapper.classList.remove("expired");
        countdownElement.style.display = "block";
        expiredMessage.style.display = "none";
    }

    rebootButton.addEventListener("click", () => {
        resetForm();
    });

    showStep(currentStep);
    initializeCheckedStates();
});