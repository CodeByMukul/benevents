"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const MouseEnterContext = createContext<{
  mouseX: number;
  mouseY: number;
}>({
  mouseX: 0,
  mouseY: 0,
});

export const CardContainer = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  return (
    <MouseEnterContext.Provider value={{ mouseX, mouseY }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={className}
        {...props}
      >
        {children}
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { mouseX, mouseY } = useContext(MouseEnterContext);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (mouseY - centerY) / 20;
    const rotateY = (centerX - mouseX) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, [mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      className={`transform transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateZ = 0,
  ...props
}: {
  as?: any;
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}) => {
  return (
    <Component
      className={className}
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
