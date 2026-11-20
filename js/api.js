const API_URL = "https://6af50467f6270fa08d67a425.mockapi.io/channels";

export async function fetchdata() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const channels = await response.json();

        return channels;

    } catch (error) {
        console.error("Failed to fetch channels:", error);
        throw error;
    }
}

export async function updateChannel(channels, id, changes) {
    try {
        const channel = channels.find(
            channel => String(channel.id) === String(id)
        );

        if (!channel) {
            throw new Error("Channel not found");
        }

        const updatedChannel = {
            ...channel,
            ...changes
        };

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedChannel)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const updatedChannels = channels.map(channel => {
            if (String(channel.id) === String(id)) {
                return updatedChannel;
            }

            return channel;
        });

        return updatedChannels;

    } catch (error) {
        console.error("Failed to update channel:", error);
        throw error;
    }
}

export async function deleteChannel(channels, id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const updatedChannels = channels.filter(
            channel => String(channel.id) !== String(id)
        );

        return updatedChannels;

    } catch (error) {
        console.error("Failed to delete channel:", error);
        throw error;
    }
}

export async function addChannel(channels, newChannel) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newChannel)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const createdChannel = await response.json();

        const updatedChannels = [
            ...channels,
            createdChannel
        ];

        return updatedChannels;

    } catch (error) {
        console.error("Failed to add channel:", error);
        throw error;
    }
}