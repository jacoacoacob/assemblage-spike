import { Canvas } from "./canvas.js";

/**
 * @param {Canvas} canvas 
 * @param {{
 *  x: number;
 *  y: number;
 *  w: number;
 *  h: number;
 *  fill: boolean;
 *  fillStyle?: string;
 *  stroke: boolean;
 *  strokeStyle?: string;
 * }} options
 */
function drawRect(canvas, options) {
    const { ctx } = canvas;
    const { x, y, w, h, fill, fillStyle, stroke, strokeStyle } = options;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    if (fill) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

/**
 * 
 * @param {Canvas} canvas 
 * @param {{
 *  x: number;
 *  y: number;
 *  r: number;
 *  fill: boolean;
 *  fillStyle?: string;
 *  stroke: boolean;
 *  strokeStyle?: string;
 * }} options 
 */
function drawArc(canvas, options) {
    const { ctx } = canvas;
    const { x, y, r, fill, fillStyle, stroke, strokeStyle } = options;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

/**
 * 
 * @param {Canvas} canvas 
 * @param {{
 *  text: string;
 *  x: number;
 *  y: number;
 *  font?: string;
 *  maxWidth?: number;
 *  fillStyle?: string;
 * }} options 
 */
function drawText(canvas, options) {
    const { ctx } = canvas;
    const { text, x, y, fillStyle, maxWidth, font, } = options;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.fillText(text, x, y, maxWidth);
    ctx.closePath();
    ctx.restore();
}

export { drawArc, drawRect, drawText };
