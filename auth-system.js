'use strict';

class AuthSystem {
    constructor() {
        this.sessions = {};
    }

    // Method to create a new user session
    createSession(userId) {
        const sessionId = this.generateSessionId();
        this.sessions[sessionId] = userId;
        return sessionId;
    }

    // Method to validate an existing session
    validateSession(sessionId) {
        return this.sessions.hasOwnProperty(sessionId);
    }

    // Method to destroy a session
    destroySession(sessionId) {
        delete this.sessions[sessionId];
    }

    // Method to generate a random session ID
    generateSessionId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

module.exports = AuthSystem;
