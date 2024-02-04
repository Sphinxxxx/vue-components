Vue.component('slider', {
    template: `
        <label class="slider">
            <span>{{ caption }}</span>
            <input :value="val" type="range" v-bind="attr" @input="handleInput">
            <output>{{ out }}</output>
        </label>
    `,
    props: ['caption', 'val', 'attr'],
    data() {
        return { };
    },
    computed: {
        out() {
            const step = this.attr?.step || 1;
            return (step < 1) ? this.val.toFixed(1) : this.val;
        }
    },
    model: {
        prop: 'val',
        event: 'do_it',
    },
    methods: {
        handleInput(e) {
            const v = Number(e.target.value);
            this.$emit('do_it', v);
        }
    },
});
