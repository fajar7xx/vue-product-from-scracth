// global channel
// using event vue
let eventBus = new Vue()


Vue.component('product', {
    props:{
        premium:{
            type: Boolean,
            required: true
        },
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img :src="image" alt="green socks">
            </div>
            <div class="product-info">
                <h1>{{title}}</h1>
                <p v-if="inStock">Stock</p>
                <p v-else>Out of stock</p>
                <p>Use is Premium: {{premium}}</p>
                <p>Shipping: {{shipping}}</p>
                <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>

                <div v-for="(variant, index) in variants" :key="variant.id" class="color-box"
                    :style="{backgroundColor: variant.color}" @mouseover="updateProduct(index)">
                    <!-- <p @mouseover="updateProduct(variant.image)">
                        {{variant.color}}
                    </p> -->
                </div>
                <button @click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add To Cart</button>
            </div>


            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    `,
    data() {
        return{
            brand: 'Vue Mastery',
            product: 'socks',
            // image: './assets/images/green-socks.jpg',
            selectedVariant: 0,
            // inStock: false,
            details: [
                "80% contton",
                "20% Polyster",
                "Gender Neutral"
            ],
            variants: [
                {
                    id: 1,
                    color: "green",
                    image: "./assets/images/green-socks.jpg",
                    quantity: 20,
                },
                {
                    id: 2,
                    color: "blue",
                    image: "./assets/images/blue-socks.jpg",
                    quantity: 1,
                }
            ],
            // cart: 0,
            reviews: [],
        }
    },
    methods: {
        addToCart(){
            // this.cart += 1
            console.log('ok')
            this.$emit('add-to-cart-now', this.variants[this.selectedVariant].id) //untuk kirim atau buat semacam emit event
        },
        updateProduct(index){
            this.selectedVariant = index
            console.log(index)
        },
        // addReview(productReview){
        //     this.reviews.push(productReview)
        // }
    },
    computed: {
        // bisa menjadi computing untuk properti data seperti titla dan image
        // dimana pada data image tidak ada makanya di buat disini
        title(){
            return this.brand + " " + this.product
        },
        image(){
            return this.variants[this.selectedVariant].image
        },
        inStock(){
            return this.variants[this.selectedVariant].quantity
        },
        shipping(){
            if (this.premium){
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },

})

Vue.component('product-review', {
    template: `
        <div>
            <form class="review-form" @submit.prevent="onSubmit">
                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors">{{error}}</li>
                    </ul>
                </p>

                <p>
                    <label for="name">Name: </label>
                    <input id="name" v-model="name" />
                </p>
                <p>
                    <label for="review">Review: </label>
                    <textarea id="review" v-model="review"></textarea>
                </p>
                <p>
                    <label for="rating">Rating: </label>
                    <select id="rating" v-model.number="rating">
                        <option>5</option>
                        <option>4</option>
                        <option>3</option>
                        <option>2</option>
                        <option>1</option>
                    </select>
                </p>
                <button type="submit">Submit</button>
            </form>
        </div>
    `,
    data(){
        return{
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit(){
            // check form validation
            if(this.name && this.rating && this.review){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                // this.$emit('review-submitted', productReview) //product review parameter yang di emit yang berasan dari variable productReview
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.review) this.errors.push("Review required.")
            }

        }
    },
})

Vue.component('product-tabs', {
    props:{
        reviews: {
            type: Array,
            required: true,
        }
    },
    template: 
        `<div>
            <span class="tab" :class="{activeTab : selectedTab === tab}" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">
            {{tab}}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>Rating: {{review.rating}}</p>
                        <p>{{review.review}}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>`,
    data(){
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


const app = new Vue({
    el: '#app',
    data: {
        premium: true,
        // cart: 0,
        cart: [],
    },
    methods: {
        updateCart(id){
            // this.cart += 1
            this.cart.push(id)
        }
    }
})