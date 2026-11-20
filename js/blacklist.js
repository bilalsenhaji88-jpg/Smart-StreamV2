import { updateChannel, deleteChannel } from "./api.js";

export function afficherListeNoire(channels, container, onChange) {

  const blacklisted = channels.filter(channel => channel.isBlacklisted);

  if (blacklisted.length === 0) {
    container.innerHTML = `
      <p class="p-4 text-sm text-gray-400">Aucune chaîne dans la liste noire.</p>
    `;
    return;
  }

  container.innerHTML = blacklisted.map(channel => {
    const id = String(channel.id);
    return `
      <div data-id="${id}" class="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1f2937]">

        <img src="${channel.logo}" alt="${channel.name}" class="w-20 h-10 object-contain">

        <div class="flex-1 text-left">
          <p class="text-sm font-medium">${channel.name}</p>
          <p class="text-xs text-gray-400">${channel.channelNumber}</p>
        </div>

        <button data-restore="${id}" class="text-xs px-2 py-2 rounded bg-green-600">Restaurer</button>
        <button data-delete="${id}" class="text-xs px-2 py-2 rounded bg-red-700">Supprimer</button>

      </div>
    `;
  }).join("");

  container.querySelectorAll("[data-restore]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.restore;
      const channel = channels.find(c => String(c.id) === id);
      if (!channel) return;

      channel.isBlacklisted = false;
      afficherListeNoire(channels, container, onChange);

      try {
        await updateChannel(channels, id, { isBlacklisted: false });
        if (onChange) onChange();
      } catch (error) {
        channel.isBlacklisted = true;
        afficherListeNoire(channels, container, onChange);
        alert("Erreur : impossible de restaurer cette chaîne.");
      }
    });
  });


  container.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.delete;
      const channel = channels.find(c => String(c.id) === id);
      if (!channel) return;

      const confirmed = confirm(`Supprimer définitivement "${channel.name}" ?`);
      if (!confirmed) return;

      try {
        await deleteChannel(channels, id);

        const index = channels.findIndex(c => String(c.id) === id);
        if (index !== -1) channels.splice(index, 1);

        afficherListeNoire(channels, container, onChange);
        if (onChange) onChange();
      } catch (error) {
        alert("Erreur : la suppression a échoué.");
      }
    });
  });

}