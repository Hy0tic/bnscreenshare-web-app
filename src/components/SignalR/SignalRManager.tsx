import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;
const url = import.meta.env.VITE_API_URL;

export const getConnection = () => {
	if (!connection)
	{
		connection = new signalR.HubConnectionBuilder()
				.withUrl(`${url}/lobby-hub`, {
					skipNegotiation: true,
					transport: signalR.HttpTransportType.WebSockets,
				})
			.withAutomaticReconnect({
				nextRetryDelayInMilliseconds: retryContext => {
					// You can add your own logic here. For example:
					// - Increase the delay with each retry
					// - Cap the maximum delay to a certain value
					// - Return null or a fixed value to keep trying indefinitely
					if (retryContext.elapsedMilliseconds < 60000) {
						// If less than 60 seconds have elapsed, retry every 10 seconds
						console.log("retrying signalR connection");
						return 1000;
					} else {
						// After 60 seconds, retry every 3 seconds
						console.log("retrying signalR connection");
						return 3000;
					}

					// Note: Returning null would stop the retry process.
				}
			})
				.build();
	}
	return connection;
};
