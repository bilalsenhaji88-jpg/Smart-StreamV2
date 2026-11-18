
import { state } from "./states.js";

export function affichage(channels, container) {
  

  if (!state.favorites) state.favorites = [];
  if (!state.blacklist) state.blacklist = [];

  container.innerHTML = channels.map(channel => {

    const id = String(channel.id);

    const isFav = state.favorites.includes(id);
    const isBlocked = state.blacklist.includes(id);

    return `
      <button data-id="${id}"
        class="w-full flex items-center gap-3 p-3 rounded-lg
        ${id === String(state.selectedId) ? "bg-blue-600" : "bg-[#1f2937]"}">

        <img
          src="${channel.logo}"
          alt="${channel.name}"
          class="w-20 h-10 object-contain"
        >

        <div class="flex-1 text-left">
          <p class="text-sm font-medium">${channel.name}</p>
          <p class="text-xs text-gray-400">${channel.channelNumber}</p>
        </div>

        <!-- FAVORITE -->
        <span data-fav="${id}"
          class="fav cursor-pointer text-2xl
          ${isFav ? "text-yellow-400" : "text-gray-400"}">
          ${isFav ? "★" : "☆"}
        </span>

        <!-- BLACKLIST -->
        <span data-bloc="${id}"
          class="bloc cursor-pointer text-2xl
          ${isBlocked ? "text-red-500" : "text-gray-400"}">
          ${isBlocked ? "🚫" : "⊘"}
        </span>

      </button>
    `;
  }).join("");

  // FAVORITES
  container.querySelectorAll(".fav").forEach(star => {

    star.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = star.dataset.fav;

      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(
          favId => favId !== id
        );
      } else {
        state.favorites.push(id);
      }

      affichage(channels, container);
    });

  });

  // BLACKLIST
  container.querySelectorAll(".bloc").forEach(button => {

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = button.dataset.bloc;

      if (state.blacklist.includes(id)) {
        state.blacklist = state.blacklist.filter(
          blockedId => blockedId !== id
        );
      } else {
        state.blacklist.push(id);
      }

      affichage(channels, container);
    });

  });

}
