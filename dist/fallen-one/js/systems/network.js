// js/systems/network.js - WebRTC Peer-to-Peer Online PvP & Input Synchronization

export class NetworkManager {
    constructor() {
        this.isHost = false;
        this.isConnected = false;
        this.roomId = null;
        this.peerConnection = null;
        this.dataChannel = null;
        this.ping = 16;
        this.lastPingTimestamp = 0;
        this.remoteInput = null;
        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
        this.onRemoteInputCallback = null;

        // BroadcastChannel fallback for multi-tab local PvP testing
        this.bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('pvp_net_channel') : null;
        if (this.bc) {
            this.bc.onmessage = (e) => this.handleLocalBroadcast(e.data);
        }
    }

    createRoom() {
        this.isHost = true;
        this.roomId = Math.floor(100000 + Math.random() * 900000).toString();
        this.initPeerConnection();
        return this.roomId;
    }

    joinRoom(roomId) {
        this.isHost = false;
        this.roomId = roomId;
        this.initPeerConnection();
        // Broadcast join request
        if (this.bc) {
            this.bc.postMessage({ type: 'JOIN_ROOM', roomId });
        }
    }

    initPeerConnection() {
        const config = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        };

        try {
            this.peerConnection = new RTCPeerConnection(config);

            if (this.isHost) {
                this.dataChannel = this.peerConnection.createDataChannel('gameplay', { ordered: false, maxRetransmits: 0 });
                this.setupDataChannel(this.dataChannel);
            } else {
                this.peerConnection.ondatachannel = (e) => {
                    this.dataChannel = e.channel;
                    this.setupDataChannel(this.dataChannel);
                };
            }
        } catch (e) {
            console.warn('WebRTC not supported, falling back to Broadcast Channel', e);
        }
    }

    setupDataChannel(channel) {
        channel.onopen = () => {
            this.isConnected = true;
            if (this.onConnectCallback) this.onConnectCallback();
        };

        channel.onclose = () => {
            this.isConnected = false;
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        };

        channel.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                this.handleNetworkMessage(msg);
            } catch (err) {}
        };
    }

    sendInput(inputSnapshot, frame) {
        const payload = {
            type: 'INPUT',
            frame: frame,
            input: inputSnapshot,
            t: Date.now()
        };

        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            this.dataChannel.send(JSON.stringify(payload));
        } else if (this.bc) {
            this.bc.postMessage(payload);
        }
    }

    handleNetworkMessage(msg) {
        if (msg.type === 'INPUT') {
            this.remoteInput = msg.input;
            this.ping = Math.max(1, Date.now() - msg.t);
            if (this.onRemoteInputCallback) {
                this.onRemoteInputCallback(msg.input, msg.frame);
            }
        }
    }

    handleLocalBroadcast(msg) {
        if (msg.type === 'JOIN_ROOM' && this.isHost && msg.roomId === this.roomId) {
            this.isConnected = true;
            if (this.bc) {
                this.bc.postMessage({ type: 'ROOM_JOINED', roomId: this.roomId });
            }
            if (this.onConnectCallback) this.onConnectCallback();
        } else if (msg.type === 'ROOM_JOINED' && !this.isHost && msg.roomId === this.roomId) {
            this.isConnected = true;
            if (this.onConnectCallback) this.onConnectCallback();
        } else if (msg.type === 'INPUT') {
            this.handleNetworkMessage(msg);
        }
    }

    disconnect() {
        if (this.dataChannel) this.dataChannel.close();
        if (this.peerConnection) this.peerConnection.close();
        this.isConnected = false;
        this.roomId = null;
    }
}

export const networkManager = new NetworkManager();
