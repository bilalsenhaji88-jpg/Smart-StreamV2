import {fetchdata} from "./api.js";
import {affichage} from "./channels.js";
import {filtrerChannels} from "./search.js";
import {selectionnerChannel} from "./preview.js";
import {afficherLoading, afficherErreur, afficherVide} from "./states.js";
import {afficherListeNoire} from "./blacklist.js";
import {initFormulaireAjout} from "./ajout.js";

async function main() {

    const container = document.getElementById("list");
    const searchInput = document.getElementById("search-input");
    const preview = document.getElementById("preview-container");
    const backBtn = document.getElementById("back-btn");

    const allBtn = document.getElementById("all-btn");
    const favoritesBtn = document.getElementById("favorites-btn");
    const blacklistBtn = document.getElementById("blacklist-btn");

    const addBtn = document.getElementById("add-btn");
    const addFormContainer = document.getElementById("add-form-container");

    afficherLoading(container);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const channels = await fetchdata();

        let currentChannels = channels;

        function setActiveViewButton(activeBtn) {
            [allBtn, favoritesBtn, blacklistBtn].filter(btn => {
                btn.classList.remove("bg-blue-600");
                btn.classList.add("bg-[#1f2937]");
            });
            activeBtn.classList.remove("bg-[#1f2937]");
            activeBtn.classList.add("bg-blue-600");
        }

        function afficherPays() {
            const pays = [...new Set(channels.map(channel => channel.country))];

            container.innerHTML = pays.map(p => `
                <button data-country="${p}" class="w-full p-3 rounded-lg bg-[#1f2937] hover:bg-blue-600 text-left text-sm">
                    ${p}
                </button>
            `).join("");

            backBtn.classList.add("hidden");
        }

        function afficherFavoris() {
            currentChannels = channels.filter(
                channel => channel.isFavorite && !channel.isBlacklisted
            );
            backBtn.classList.add("hidden");
            affichage(currentChannels, container);
        }

        const lastView = localStorage.getItem("lastView");

        if (lastView === "favorites") {
            setActiveViewButton(favoritesBtn);
            afficherFavoris();
        } else {
            setActiveViewButton(allBtn);
            afficherPays();
        }

        container.addEventListener("click", (event) => {
            const btn = event.target.closest("button[data-country]");

            if (!btn) return;

            currentChannels = channels.filter(channel => channel.country === btn.dataset.country);
            affichage(currentChannels, container);
            backBtn.classList.remove("hidden");
        });

        backBtn.addEventListener("click", () => {
            currentChannels = channels;
            searchInput.value = "";
            setActiveViewButton(allBtn);
            afficherPays();
        });

        selectionnerChannel(container, channels, preview);

        searchInput.addEventListener("input", function () {

            const search = searchInput.value;

            if (search ==="") {
                if (currentChannels === channels) {
                    afficherPays();
                } else {
                    affichage(currentChannels, container);
                }
                return;
            }

            const result = filtrerChannels(currentChannels, search);

            if (result.length === 0) {
                afficherVide(container, search);
            } else {
                affichage(result, container);
            }

        });



        allBtn.addEventListener("click", () => {
            setActiveViewButton(allBtn);
            searchInput.value = "";
            currentChannels = channels;
            afficherPays();
            localStorage.setItem("lastView", "all");
        });

        favoritesBtn.addEventListener("click", () => {
            setActiveViewButton(favoritesBtn);
            afficherFavoris();
            localStorage.setItem("lastView", "favorites");
        });

        blacklistBtn.addEventListener("click", () => {
            setActiveViewButton(blacklistBtn);
            backBtn.classList.add("hidden");
            afficherListeNoire(channels, container, () => {

            })
        })

        initFormulaireAjout(channels, addFormContainer, addBtn, () => {
            currentChannels = channels;
            setActiveViewButton(allBtn);
            searchInput.value = "";
            localStorage.setItem("lastView", "all");
            afficherPays();
        });

    }catch (error) {
        console.error("Erreur lors du chargement des chaînes :", error);
        afficherErreur(container, "Impossible de charger les chaînes. Vérifie ta connexion.");
    }
}

main();