import { addChannel } from "./api.js";

export function initFormulaireAjout(channels, formContainer, addBtn, onChange) {

    addBtn.addEventListener("click", () => {
        formContainer.classList.toggle("hidden");
    });

    const submitBtn = formContainer.querySelector("#submit-add");
    const numberInput = formContainer.querySelector("#input-number");
    const nameInput = formContainer.querySelector("#input-name");
    const categoryInput = formContainer.querySelector("#input-category");
    const logoInput = formContainer.querySelector("#input-logo");
    const errorMsg = formContainer.querySelector("#add-error");

    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const channelNumber = numberInput.value.trim();
        const name = nameInput.value.trim();
        const country = categoryInput.value.trim();
        const logo = logoInput.value.trim();

        if (channelNumber === "" || name === "") {
            errorMsg.textContent = "Le numéro et le nom sont obligatoires.";
            errorMsg.classList.remove("hidden");
            return;
        }

        errorMsg.classList.add("hidden");

        const ids = channels.map(channel => Number(channel.id));
        const newId = ids.length === 0 ? 1 : Math.max(...ids) + 1;

        const newChannel = {
            id: newId,
            channelNumber,
            name,
            country,
            logo,
            streamUrl: "",
            isFavorite: false,
            isBlacklisted: false
        };

        try {
            await addChannel(channels, newChannel);
            channels.push(newChannel);

            numberInput.value = "";
            nameInput.value = "";
            categoryInput.value = "";
            logoInput.value = "";
            formContainer.classList.add("hidden");

            if (onChange) onChange();

        } catch (error) {
            errorMsg.textContent = "Erreur : impossible d'ajouter la chaîne.";
            errorMsg.classList.remove("hidden");
        }
    });

}