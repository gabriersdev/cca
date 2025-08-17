/**
 * Centralized Event Manager for CCA application
 * Manages all event listeners in a organized and maintainable way
 */
export class EventManager {
  constructor() {
    this.listeners = new Map();
    this.globalHandlers = new Map();
  }

  /**
   * Add event listener with automatic cleanup tracking
   * @param {Element|string} element - Element or selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler function
   * @param {Object} options - Event listener options
   * @returns {string} - Listener ID for removal
   */
  addListener(element, event, handler, options = {}) {
    const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!targetElement) {
      console.warn(`EventManager: Element not found for selector: ${element}`);
      return null;
    }

    const listenerId = this.generateListenerId();
    
    targetElement.addEventListener(event, handler, options);
    
    this.listeners.set(listenerId, {
      element: targetElement,
      event,
      handler,
      options
    });

    return listenerId;
  }

  /**
   * Add event listeners to multiple elements matching a selector
   * @param {string} selector - CSS selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler function
   * @param {Object} options - Event listener options
   * @returns {Array} - Array of listener IDs
   */
  addListeners(selector, event, handler, options = {}) {
    const elements = document.querySelectorAll(selector);
    const listenerIds = [];

    elements.forEach(element => {
      const listenerId = this.addListener(element, event, handler, options);
      if (listenerId) {
        listenerIds.push(listenerId);
      }
    });

    return listenerIds;
  }

  /**
   * Remove specific event listener
   * @param {string} listenerId - Listener ID to remove
   */
  removeListener(listenerId) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      listener.element.removeEventListener(listener.event, listener.handler, listener.options);
      this.listeners.delete(listenerId);
    }
  }

  /**
   * Remove all event listeners from an element
   * @param {Element} element - Element to clean up
   */
  removeElementListeners(element) {
    const toRemove = [];
    this.listeners.forEach((listener, id) => {
      if (listener.element === element) {
        toRemove.push(id);
      }
    });
    
    toRemove.forEach(id => this.removeListener(id));
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    this.listeners.forEach((listener, id) => {
      this.removeListener(id);
    });
  }

  /**
   * Register a global handler function (replaces window.functionName pattern)
   * @param {string} name - Function name
   * @param {Function} handler - Handler function
   */
  registerGlobalHandler(name, handler) {
    this.globalHandlers.set(name, handler);
    
    // For backward compatibility, still expose on window but managed
    if (typeof window !== 'undefined') {
      window[name] = handler;
    }
  }

  /**
   * Get a registered global handler
   * @param {string} name - Function name
   * @returns {Function|null} - Handler function or null
   */
  getGlobalHandler(name) {
    return this.globalHandlers.get(name) || null;
  }

  /**
   * Initialize event delegation for dynamic content
   * @param {string} selector - Selector for event delegation
   * @param {string} event - Event type
   * @param {string} targetSelector - Target element selector within the delegated element
   * @param {Function} handler - Event handler
   */
  delegateEvent(selector, event, targetSelector, handler) {
    return this.addListener(selector, event, (e) => {
      if (e.target.matches(targetSelector) || e.target.closest(targetSelector)) {
        handler.call(e.target.closest(targetSelector) || e.target, e);
      }
    });
  }

  /**
   * Initialize common event patterns
   */
  initializeCommonPatterns() {
    // Handle modal triggers
    this.delegateEvent(document, 'click', '[data-action="acionar-modal"]', (e) => {
      const modal_nome = e.target.getAttribute('data-bs-target') || e.target.closest('button').getAttribute('data-bs-target');
      if (modal_nome) {
        setTimeout(() => {
          const modal = document.querySelector(modal_nome);
          if (modal) {
            const inputs = modal.querySelectorAll('input');
            const textareas = modal.querySelectorAll('textarea');
            
            if (inputs.length > 0) {
              inputs[0].focus();
            } else if (textareas.length > 0) {
              textareas[0].focus();
            }
          }
        }, 500);
      }
    });

    // Handle page reload buttons
    this.delegateEvent(document, 'click', '[data-recarrega-pagina]', () => {
      window.location.reload();
    });

    // Handle dialog close buttons
    this.delegateEvent(document, 'click', '[data-action="fechar-modal-dialog"]', (e) => {
      const dialog = e.target.closest('dialog');
      if (dialog) {
        dialog.close();
      }
    });
  }

  /**
   * Generate unique listener ID
   * @returns {string} - Unique ID
   */
  generateListenerId() {
    return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get information about registered listeners (for debugging)
   * @returns {Object} - Listener statistics
   */
  getStats() {
    return {
      totalListeners: this.listeners.size,
      globalHandlers: this.globalHandlers.size,
      listenerTypes: Array.from(this.listeners.values()).reduce((acc, listener) => {
        acc[listener.event] = (acc[listener.event] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

// Create singleton instance
export const eventManager = new EventManager();