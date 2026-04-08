"use client";

import { useState } from "react";
import styled from "styled-components";

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ff6a00;
  cursor: pointer;
  z-index: 100;
`;

const Handle = styled.div`
  padding: 0.6em 1.5em;
  font-size: 1rem;
  color: black;
  user-select: none;
`;

const Content = styled.div`
  max-height: ${({ $open }) => ($open ? "400px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s ease;
  padding: ${({ $open }) => ($open ? "1.5em" : "0")} 1.5em;
  font-size: 0.95rem;
  line-height: 1.6;
  color: black;
`;

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <Bar onClick={() => setOpen((o) => !o)}>
      <Handle>Hannah Böker</Handle>
      <Content $open={open}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </Content>
    </Bar>
  );
}
