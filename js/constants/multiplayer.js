        // 连接参数
        const urlParams = new URLSearchParams(window.location.search);
        const roomId = urlParams.get('room') || 'default';
        const playerId = urlParams.get('player') || '1';
        
        // 设置UI显示
        document.getElementById('room-id').textContent = roomId;
        document.getElementById('player-id').textContent = playerId;
        
        // WebSocket连接
        let socket;
        let isConnected = false;
        
        function connectWebSocket() {
            const wsUrl = `ws://192.168.1.16:3000?room=${roomId}&player=${playerId}`;
            socket = new WebSocket(wsUrl);
            
            socket.onopen = () => {
                console.log('已连接到服务器');
                isConnected = true;
                document.getElementById('connection-status').textContent = '已连接';
                document.getElementById('connection-status').style.color = 'green';
            };
            
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleServerMessage(data);
            };
            
            socket.onclose = () => {
                console.log('连接已断开');
                isConnected = false;
                document.getElementById('connection-status').textContent = '已断开';
                document.getElementById('connection-status').style.color = 'red';
                // 尝试重新连接
                setTimeout(connectWebSocket, 3000);
            };
            
            socket.onerror = (error) => {
                console.error('WebSocket错误:', error);
            };
        }
        
        function handleServerMessage(data) {
            switch (data.type) {
                case 'game_state':
                    // 更新游戏状态
                    Object.assign(gameState, data.state);
                    updateUI();
                    break;
                    
                case 'game_update':
                    // 更新游戏状态
                    Object.assign(gameState, data.state);
                    updateUI();
                    break;
                    
                case 'player_joined':
                    alert(`玩家 ${data.player} 已加入游戏`);
                    break;
                    
                case 'player_left':
                    alert(`玩家 ${data.player} 已离开游戏`);
                    break;
                    
                case 'chat_message':
                    addChatMessage(data.from, data.message);
                    break;
            }
        }
        
        function sendGameAction() {
            if (!isConnected) return;
            
            socket.send(JSON.stringify({
                type: 'game_action',
                state: gameState
            }));
        }
        
        function sendChatMessage(message) {
            if (!isConnected) return;
            
            socket.send(JSON.stringify({
                type: 'chat_message',
                message: message,
                from: playerId
            }));
        }
        
        function addChatMessage(from, message) {
            const chat = document.getElementById('chat-messages');
            const msgElement = document.createElement('div');
            msgElement.textContent = `玩家${from}: ${message}`;
            chat.appendChild(msgElement);
            chat.scrollTop = chat.scrollHeight;
        }
        
        function sendChat() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            if (message) {
                sendChatMessage(message);
                addChatMessage(playerId, message);
                input.value = '';
            }
        }
