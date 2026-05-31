let stompClient = null;

connect();

function connect() {

    let socket =
        new SockJS('/chat');

    stompClient =
        Stomp.over(socket);

    stompClient.connect({}, function () {

        stompClient.subscribe(
            '/topic/messages',
            function(message) {

                showMessage(
                    JSON.parse(message.body)
                );
            });
    });
}

function sendMessage() {

    let sender =
        document.getElementById(
            "username").value;

    let content =
        document.getElementById(
            "message").value;

    if(sender === "" || content === "")
        return;

    stompClient.send(
        "/app/send",
        {},
        JSON.stringify({
            sender: sender,
            content: content,
            type: "CHAT"
        })
    );

    document.getElementById(
        "message").value = "";
}

function showMessage(message) {

    let chatArea =
        document.getElementById(
            "chatArea");

    let p =
        document.createElement("p");

    p.innerHTML =
        "<b>" +
        message.sender +
        ":</b> " +
        message.content;

    chatArea.appendChild(p);

    chatArea.scrollTop =
        chatArea.scrollHeight;
}