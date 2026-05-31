let stompClient = null;

connect();

function connect() {

    const socket = new SockJS('/chat');

    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        stompClient.subscribe('/topic/messages',
            function (message) {

                showMessage(
                    JSON.parse(message.body)
                );
            });
    });
}

function sendMessage() {

    const sender =
        document.getElementById("username").value;

    const content =
        document.getElementById("message").value;

    if(sender === "" || content === "")
        return;

    const id =
        Date.now().toString();

    stompClient.send(
        "/app/message",
        {},
        JSON.stringify({
            id: id,
            sender: sender,
            content: content,
            type: "CHAT"
        })
    );

    document.getElementById("message").value = "";
}

function showMessage(message) {

    if(message.type === "CHAT") {

        const chatArea =
            document.getElementById("chatArea");

        const div =
            document.createElement("div");

        div.className = "message";

        div.id = message.id;

     div.innerHTML = `
    <div class="message-row">
        <span class="msg">
            <b>${message.sender}:</b> ${message.content}
        </span>

        <div class="actions">
            <i class="fa-solid fa-pen-to-square edit-icon"
               onclick="editMessage('${message.id}')"></i>

            <i class="fa-solid fa-trash delete-icon"
               onclick="deleteMessage('${message.id}')"></i>
        </div>
    </div>
`;

        chatArea.appendChild(div);

        chatArea.scrollTop =
            chatArea.scrollHeight;
    }

    else if(message.type === "EDIT") {

        const div =
            document.getElementById(message.id);

        if(div) {

            div.querySelector(".msg").innerHTML =
                `<b>${message.sender}:</b>
                 ${message.content}`;
        }
    }

    else if(message.type === "DELETE") {

        const div =
            document.getElementById(message.id);

        if(div) {
            div.remove();
        }
    }
}

function editMessage(id) {

    const newText =
        prompt("Edit your message");

    if(!newText)
        return;

    const username =
        document.getElementById("username").value;

    stompClient.send(
        "/app/message",
        {},
        JSON.stringify({
            id: id,
            sender: username,
            content: newText,
            type: "EDIT"
        })
    );
}

function deleteMessage(id) {

    if(confirm("Delete this message?")) {

        stompClient.send(
            "/app/message",
            {},
            JSON.stringify({
                id: id,
                type: "DELETE"
            })
        );
    }
}