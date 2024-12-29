import { model, models, Schema, Document } from "mongoose";

// Define the interface for the Code Post document
interface ICodePost extends Document {
  username: string; // Contributor's name
  title: string; // Title of the code post
  description: string; // Description of the code
  technologies: string[]; // Array of technology names
  screenshots: string[]; // URLs of uploaded images/screenshots
  github?: string; // Optional GitHub repository link
  code?: string; // Optional code content
  externalLinks?: {
    type: string; // Social platform (e.g., Twitter, LinkedIn)
    url: string; // Link to the external resource
  }[]; // Array of external links
}

// Create the schema using the interface
const CodePostSchema = new Schema<ICodePost>(
  {
    username: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], required: true },
    screenshots: { type: [String], required: true },
    github: {
      type: String,
      validate: {
        validator: function (v: string) {
          // Allow null or valid URLs
          return v === null || /^https?:\/\/.+/.test(v);
        },
        message: "Invalid URL format.",
      },
      default: null, // Default value is null
      required: false, // Field is optional
    },
    code: { type: String },
    externalLinks: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the model
export const CodePost =
  models?.CodePost || model<ICodePost>("CodePost", CodePostSchema);
