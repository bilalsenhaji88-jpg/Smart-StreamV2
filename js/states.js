export const state = {
    selectedId: null
};

export function afficherLoading(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center gap-3 p-6">
            <div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-gray-400">Chargement...</p>
        </div>
    `;
}

export function afficherErreur(container, message) {
    container.innerHTML = `
        <div class="p-4 rounded-lg bg-red-900/40 text-sm">
            <p class="mb-3">${message}</p>
            <button id="retry-btn" class="px-3 py-2 rounded bg-blue-600">
                Réessayer
            </button>
        </div>
    `;

    container.querySelector("#retry-btn")
        .addEventListener("click", () => location.reload());
}

export function afficherVide(container, search) {
    container.innerHTML = `
        <p class="p-4 text-sm text-gray-400">
            Aucune chaîne trouvée pour « <span id="empty-search"></span> »
        </p>
    `;

    container.querySelector("#empty-search").textContent = search;
}