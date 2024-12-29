import { CodeEditor } from "@/components/code-editor";
import GitHubFileExplorer from "@/components/github-explorer";
import Modal from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import technologies from "@/lib/technologies";
import React from "react";
import axios from "axios";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { ImageWithSkeleton } from "@/components/imagewithskeleton";

// Define the type for the dynamic route props

export default async function CodePageModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Fetch the code post data
  const res = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/code-posts/${id}`
  );
  const data = res.data;

  if (res.status !== 200) {
    return (
      <Modal>
        <div className="p-6">
          <h1 className="text-2xl text-center font-bold">Post Not Found</h1>
          <p className="text-center text-gray-600">
            Sorry, we couldn&apos;t find the post you&apos;re looking for.
          </p>
        </div>
      </Modal>
    );
  }

  const { post } = data;

  const selectedLanguage =
    technologies.find((tech) => post.technologies.includes(tech.name))
      ?.language || "plaintext";

  return (
    <Modal>
      <div className="overflow-y-auto p-6 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold">{post.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By: {post.username}
          </p>
        </div>

        {/* Carousel */}
        <div>
          <Carousel>
            <CarouselContent>
              {post.screenshots.map((screenshot: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[17rem] md:h-[25rem] lg:h-[30rem]">
                    <ImageWithSkeleton
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>

        {/* Code Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">The Code</h2>
          {post.github && <GitHubFileExplorer githubUrl={post.github} />}
          <div className="pt-4">
            <CodeEditor
              initialCode={post.code}
              selectedLanguage={selectedLanguage}
            />
          </div>
        </div>

        {/* Code Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Code Description
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300 px-6">
            {post.description}
          </p>
        </div>

        {/* Technologies Used */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Technologies Used
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {post.technologies.map((techName: string, index: number) => {
              const tech = technologies.find(
                (t) => t.name.toLowerCase() === techName.toLowerCase()
              );
              return tech ? (
                <Badge
                  key={index}
                  className="cursor-pointer text-white text-sm flex items-center px-4 py-2 rounded-full"
                  style={{ backgroundColor: tech.color }}
                >
                  <tech.icon className="mr-2" size={16} />
                  {tech.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">Contact Me</h2>
          <div className="flex justify-center items-center space-x-6 text-2xl">
            {post.externalLinks.map((link: { type: string; url: string }) => {
              if (link.type.toLocaleLowerCase() === "x (twitter)") {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    aria-label="Twitter"
                    className="hover:text-black dark:hover:text-white"
                    target="_blank"
                  >
                    <FaXTwitter />
                  </a>
                );
              }

              if (link.type.toLocaleLowerCase() === "github") {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    aria-label="GitHub"
                    className="hover:text-gray-800"
                    target="_blank"
                  >
                    <FaGithub />
                  </a>
                );
              }

              if (link.type.toLocaleLowerCase() === "linkedin") {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    aria-label="LinkedIn"
                    className="hover:text-blue-600"
                    target="_blank"
                  >
                    <FaLinkedin />
                  </a>
                );
              }

              if (link.type.toLocaleLowerCase() === "facebook") {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    aria-label="Facebook"
                    className="hover:text-blue-500"
                    target="_blank"
                  >
                    <FaFacebook />
                  </a>
                );
              }

              if (link.type.toLocaleLowerCase() === "instagram") {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    aria-label="Instagram"
                    className="hover:text-pink-500"
                    target="_blank"
                  >
                    <FaInstagram />
                  </a>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
