document.addEventListener('DOMContentLoaded', () => {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.button-next');
    const copyButton = document.querySelector(".button-copy-code");

    let currentStep = 0;

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

    showStep(currentStep);
    initializeCheckedStates();
});