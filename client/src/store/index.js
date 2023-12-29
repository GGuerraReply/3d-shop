import { proxy } from 'valtio';

const state = proxy({
    intro: true,
    color: "#02D34A",
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: "./logo_white.png",
    fullDecal: "./texture.jpg"
});

export default state;