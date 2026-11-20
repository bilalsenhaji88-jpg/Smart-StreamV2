import { state } from "./states.js";
import { updateChannel } from "./api.js";

export function affichage(channels, container) {

  
  const visibleChannels = channels.filter(channel => !channel.isBlacklisted);

  container.innerHTML = visibleChannels.map(channel => {

    const id = String(channel.id);
    const isFav = Boolean(channel.isFavorite);

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

   
        <span data-bloc="${id}"
          class="bloc cursor-pointer text-2xl text-gray-400">
          🚫
        </span>

      </button>
    `;
  }).join("");

  
  container.querySelectorAll(".fav").forEach(star => {

    star.addEventListener("click", async (e) => {
      e.stopPropagation();

      const id = star.dataset.fav;
      const channel = channels.find(c => String(c.id) === id);
      if (!channel) return;

      const previous = channel.isFavorite;
      channel.isFavorite = !previous;
      affichage(channels, container);

      try {
        await updateChannel(channels, id, { isFavorite: channel.isFavorite });
      } catch (error) {
    
      
      
        console.error("Erreur : le favori n'a pas pu être enregistré.",error)
      }
    });

  });

  
  container.querySelectorAll(".bloc").forEach(button => {

    button.addEventListener("click", async (e) => {
      e.stopPropagation();

      const id = button.dataset.bloc;
      const channel = channels.find(c => String(c.id) === id);
      if (!channel) return;

      channel.isBlacklisted = true;
      affichage(channels, container); 

      try {
        await updateChannel(channels, id, { isBlacklisted: true });
      } catch (error) {
        channel.isBlacklisted = false;
        affichage(channels, container);
      console.log("Erreur : impossible de masquer cette chaîne.",error);
      }
    });

  });

}