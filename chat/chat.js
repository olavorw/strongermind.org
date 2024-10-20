const chatId = localStorage.getItem('chatId') || generateChatId();
localStorage.setItem('chatId', chatId);

function generateChatId() {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function addBotMessage(message) {
	const chatContainer = document.getElementById('chatContainer');
	const scrollableDiv = document.getElementById('chat');
	const chat = chatContainer.querySelector('.chat');

	const botMessage = document.createElement('div');
	botMessage.classList.add('chat-message', 'bot-message');
	botMessage.innerHTML = `<span class="message">${message}</span>`;
	chat.appendChild(botMessage);
	chatContainer.scrollTop = chatContainer.scrollHeight;
	scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

function addUserMessage(message) {
	const chatContainer = document.getElementById('chatContainer');
	const scrollableDiv = document.getElementById('chat');
	const chat = chatContainer.querySelector('.chat');

	const userMessage = document.createElement('div');
	userMessage.classList.add('chat-message', 'user-message');
	userMessage.innerHTML = `<span class="message">${message}</span>`;
	chat.appendChild(userMessage);
	chatContainer.scrollTop = chatContainer.scrollHeight;
	scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

function getUserInput() {
	return document.getElementById('userInput').value;
}

function clearUserInput() {
	document.getElementById('userInput').value = '';
}
function deleteAllCookies() {
	const cookies = document.cookie.split(';');

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf('=');
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
	}

	console.log('All cookies deleted');
}
async function deleteChatHistory(chatId) {
	if (confirm("Are you sure you want to do that?") == true) {
		deleteAllCookies()
		try {
			const response = await fetch('https://strongermind.olavorw.workers.dev/', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-Chat-ID': chatId
				}
			});

			if (response.ok) {
				const result = await response.json();
				console.log('Chat history deleted successfully:', result.message);
			} else {
				const error = await response.json();
				alert('Failed to delete chat history:', error.error);
			}
		} catch (error) {
			alert('Error during deletion request:', error);
		}
		alert("Data successfully deleted.")
	}
}

async function sendMessage() {
	const userInput = DOMPurify.sanitize(getUserInput());
	if (userInput.trim() !== '') {
		document.getElementById('userInput').disabled = true;
		document.querySelector('button').disabled = true;

		addUserMessage(userInput);
		clearUserInput();

		await fetch('https://strongermind.olavorw.workers.dev/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Chat-ID': chatId
			},
			body: JSON.stringify({
				'input': userInput
			})
		})
			.then(response => response.text())
			.then(data => {
				try {
					const jsonResponse = JSON.parse(data);
					if (jsonResponse && jsonResponse.response) {
						const botMessage = DOMPurify.sanitize(jsonResponse.response);
						addBotMessage(botMessage);
					} else {
						addBotMessage("Error: Invalid response format.");
					}
				} catch (error) {
					addBotMessage("Error: Unable to parse response.");
				}
			})
			.catch(error => {
				addBotMessage("Error: Unable to fetch response.");
			})
			.finally(() => {
				// Re-enable input and button once processing is complete
				document.getElementById('userInput').disabled = false;
				document.querySelector('button').disabled = false;
				document.getElementById('userInput').focus();
			});
	}
}

document.getElementById('userInput').addEventListener('keydown', function (event) {
	if (event.key === 'Enter' && !document.getElementById('userInput').disabled) {
		sendMessage();
	}
});