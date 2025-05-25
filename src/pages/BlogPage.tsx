"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../lib/utils";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
}

// Create context for 3D card effects
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/data/blogPost.json");
        if (!res.ok) throw new Error("Failed to fetch blog posts.");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Custom hook for mouse enter context
  const useMouseEnter = () => {
    const context = useContext(MouseEnterContext);
    if (context === undefined) {
      throw new Error("useMouseEnter must be used within a MouseEnterProvider");
    }
    return context;
  };

  // Card container component with 3D effects
  const CardContainer = ({
    children,
    className,
    containerClassName,
  }: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseEnter = () => {
      setIsMouseEntered(true);
    };

    const handleMouseLeave = () => {
      if (!containerRef.current) return;
      setIsMouseEntered(false);
      containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    };

    return (
      <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
        <div
          className={cn(
            "flex items-center justify-center",
            containerClassName
          )}
          style={{
            perspective: "1000px",
          }}
        >
          <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "relative transition-all duration-200 ease-linear",
              className
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {children}
          </div>
        </div>
      </MouseEnterContext.Provider>
    );
  };

  // Card item component with 3D transformations
  const CardItem = ({
    as: Tag = "div",
    children,
    className,
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    ...rest
  }: {
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
    [key: string]: any;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isMouseEntered] = useMouseEnter();

    useEffect(() => {
      if (!ref.current) return;
      if (isMouseEntered) {
        ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
      } else {
        ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
      }
    }, [isMouseEntered]);

    return (
      <Tag
        ref={ref}
        className={cn("w-fit transition duration-200 ease-linear", className)}
        {...rest}
      >
        {children}
      </Tag>
    );
  };

  if (selectedPost) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div whileHover={{ x: -5 }} className="inline-block">
          <Link
            to="/blog"
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <ArrowLeft className="mr-2" /> Back to all posts
          </Link>
        </motion.div>

        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose max-w-none text-gray-800 dark:text-gray-200"
        >
          <motion.h1 
            className="text-4xl font-bold mb-2 text-gray-900 dark:text-white"
            whileHover={{ scale: 1.02 }}
          >
            {selectedPost.title}
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8 dark:text-gray-400"
            whileHover={{ scale: 1.01 }}
          >
            {new Date(selectedPost.date).toLocaleDateString()}
          </motion.p>
          
          {selectedPost.image && (
            <motion.div 
              className="w-full h-64 overflow-hidden rounded-lg mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <img
                src={selectedPost.image.startsWith('/') ? selectedPost.image : `/images/${selectedPost.image}`}
                alt={selectedPost.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
            </motion.div>
          )}

          <ReactMarkdown
            components={{
              code({ inline, className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div">
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </motion.div>
                ) : (
                  <code className={className}>{children}</code>
                );
              },
              p: ({ children }) => (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-800 dark:text-gray-200"
                >
                  {children}
                </motion.p>
              ),
              h2: ({ children }) => (
                <motion.h2
                  className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white"
                  whileHover={{ scale: 1.01 }}
                >
                  {children}
                </motion.h2>
              ),
            }}
          >
            {selectedPost.content}
          </ReactMarkdown>
        </motion.article>
      </motion.div>
    );
  }

  return (
    <div className="relative bg-gray-950 text-white min-h-screen overflow-hidden">
      {/* Animated Particle Background */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle,#3b82f6_1px,transparent_1px)] bg-[length:30px_30px] opacity-10 pointer-events-none z-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
        >
          Fitness Blog
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg max-w-md mx-auto text-center"
          >
            {error}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="mt-3 bg-white text-red-900 px-4 py-2 rounded-md font-medium"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {posts.map((post, index) => (
                <CardContainer
                  key={post.id}
                  containerClassName="w-full h-full"
                  className="w-full h-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative w-full h-80"
                  >
                    {/* Front of Card */}
                    <CardItem
                      translateZ="20px"
                      className="absolute inset-0 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-between text-center [backface-visibility:hidden]"
                    >
                      <div className="w-full h-32 overflow-hidden rounded-lg mb-4">
                        <img
                          src={post.image?.startsWith('/') ? post.image : `/images/${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      <motion.h2 
                        className="text-lg font-bold text-white"
                        whileHover={{ scale: 1.02 }}
                      >
                        {post.title}
                      </motion.h2>
                      <motion.p 
                        className="text-xs text-gray-400"
                        whileHover={{ scale: 1.01 }}
                      >
                        {new Date(post.date).toLocaleDateString()}
                      </motion.p>
                    </CardItem>

                    {/* Back of Card */}
                    <CardItem
                      translateZ="-20px"
                      rotateY="180deg"
                      className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 rounded-xl p-6 flex flex-col justify-between [backface-visibility:hidden]"
                    >
                      <motion.p 
                        className="text-sm line-clamp-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {post.excerpt}
                      </motion.p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPost(post)}
                        className="mt-4 bg-white text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition flex items-center justify-center gap-1"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </CardItem>

                    {/* Glowing animated border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none border-2 border-blue-500/30"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(59, 130, 246, 0)",
                          "0 0 20px rgba(59, 130, 246, 0.3)",
                          "0 0 10px rgba(59, 130, 246, 0)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </CardContainer>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating action button */}
      <motion.div
        className="fixed bottom-8 right-8 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/generate"
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg text-white"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default BlogPage;