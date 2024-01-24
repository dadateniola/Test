const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const selectWith = (p, e) => p.querySelector(e);
const selectAllWith = (p, e) => p.querySelectorAll(e);
const create = (e) => document.createElement(e);
const root = (e) => getComputedStyle(select(":root")).getPropertyValue(e);
const getStyle = (e, style) => window.getComputedStyle(e)[style];

class Slider {
    constructor(params = {}) {
        Object.assign(this, params);
        this.init();
    }

    conditions() {
        if (!this?.amount) this.amount = 1;

        if (!this?.gap) this.gap = 0;

        if (!this?.slider) return false;

        return this.slider instanceof HTMLElement;
    }

    init() {
        if (!this.conditions()) return console.log("Basic slider conditions not met");

        this.setupSlides();

        this.imagesLoaded = 0;
        this.images = selectAll(".slider img");
        this.images.forEach(image => {
            if (image.complete) {
                this.checkLoadedImages();
            } else {
                image.onload = () => this.checkLoadedImages();
            }
        })
    }

    //Slider methods
    setupSlides() {
        //Don't edit the code under this function
        this.fullWidth = 100 * this.amount;
        this.slideWidth = 100 / this.amount;

        Slider.insertToDOM({ type: "div", parent: this.slider, classes: 'slider', properties: { width: `calc(${this.fullWidth}% + ${this.gap * this.amount}px)` } });

        for (let i = 1; i <= this.amount; i++) {
            const slide = Slider.insertToDOM({ type: "div", parent: select(".slider"), classes: (i == 1) ? ['slide', 'active'] : 'slide', properties: { width: `calc(${this.slideWidth}% - ${this.gap}px)`, marginLeft: (i > 1) ? `${this.gap}px` : 0 } });
            Slider.insertToDOM({ type: "img", text: `./img/img (${i}).jpg`, parent: slide });
        }

        const slide = Slider.insertToDOM({ type: "div", parent: select(".slider"), classes: ['slide', 'end'], properties: { width: `calc(${this.slideWidth}% - ${this.gap}px)`, marginLeft: `${this.gap}px` } });
        Slider.insertToDOM({ type: "img", text: `./img/img (1).jpg`, parent: slide });
    }

    animate() {
        const tl = gsap.timeline({ defaults: { duration: 2.8, ease: "Expo.easeInOut" } });

        const activeSlide = select(".slide.active");
        const activeImg = selectWith(activeSlide, "img");
        const nextSlide = activeSlide?.nextElementSibling;
        const nextImg = selectWith(nextSlide, "img");

        const slider = select(".slider");
        const width = parseInt(slider.dataset?.width) || this.slideWidth;

        tl
            .set(nextImg, { xPercent: -30 })
            .to(slider, { xPercent: -width, delay: 0.8 })
            .to(activeImg, { xPercent: 30, clearProps: "transform" }, "<")
            .to(nextImg, { xPercent: 0 }, "<")
            .call(() => {
                if (nextSlide.classList.contains("end")) {
                    gsap.set(slider, { xPercent: 0 });

                    slider.dataset.width = this.slideWidth;
                    activeSlide.classList?.remove("active");
                    selectAll(".slide")[0].classList.add("active");
                } else {
                    slider.dataset.width = width + this.slideWidth;

                    activeSlide.classList?.remove("active");
                    nextSlide.classList?.add("active");
                }

                this.animate();
            });
    }

    checkLoadedImages() {
        this.imagesLoaded++;
        if (this.imagesLoaded === this.images.length) {
            console.log("All images loaded");

            gsap.to(".slider", { opacity: 1, delay: 1, onComplete: () => {
                select("main").classList.add("stop");
                this.animate();
            }});
        }
    }

    //Static Methods
    static insertToDOM(params = {}) {
        const { type, text, parent, before, classes, properties } = params;

        if (!type || !parent) return null;

        //Insert element contents
        const element = create(type);

        if (text) {
            if (type == "img") element.src = text;
            else element.innerHTML = text;
        }

        //Add classes
        if (classes?.length) {
            if (Array.isArray(classes)) classes.forEach(c => element.classList.add(c));
            else element.classList.add(classes);
        }

        //Change properties
        if (properties) {
            if (Slider.isObject(properties)) {
                for (const property in properties) {
                    element.style[property] = properties[property];
                }
            }
        }

        //Append element to parent
        if (before) parent.insertBefore(element, before);
        else parent.appendChild(element);

        return element;
    }

    static isObject(value) {
        return (typeof value === 'object' && value !== null && !Array.isArray(value));
    }
}

window.onload = () => {
    new Slider({ slider: select("main"), amount: 5, gap: 20 });
}