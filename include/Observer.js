/**
 * Abstraction layer - file with abstract classes to implement design patters in our project.
 * Subject is an abstract class for Observer pattern.
 */
export default class Subject {
    constructor() {
        this.observers = new Array();
    }
  
    addObserver(observer) {
        if (typeof observer == "object" && typeof observer.update == "function") {
            this.observers.push(observer);
            return true;
        } else {
            throw new Error("observer must implement update() method!");
        }
    }
  
    removeObserver(observer) {
        let removeIndex = this.observers.findIndex(o => {
            return observer === o;
        });
  
        if (removeIndex !== -1) {
            this.observers = this.observers.slice(removeIndex, 1);
        }
    }
  
    notifyAll(data) {
        if (this.observers.length > 0) {
            this.observers.forEach(observer => observer.update(data));
        }
    }

    notify(observer, data) {
        observer.update(data);
    }
}

export {Subject}