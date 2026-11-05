import mongoose from "mongoose";
import { cloudinaryHttpsPlugin } from "../Utils/mongoosePlugins.js";

/**
 * Registers the global schema plugins.
 *
 * This module must be imported *before* any model is compiled, therefore every
 * model file imports it as its very first dependency.
 */
mongoose.plugin(cloudinaryHttpsPlugin);

export default mongoose;
