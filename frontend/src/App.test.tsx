import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// A simple isolated component for testing
const ForgeButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <button onClick={onClick} className="forge-button">{children}</button>
);

describe('SkillForge Frontend Core', () => {
  it('should render ForgeButton properly', () => {
    render(<ForgeButton>Strike Anvil</ForgeButton>);
    expect(screen.getByText('Strike Anvil')).toBeDefined();
  });
  
  it('should pass a basic logic test', () => {
    const calculateXP = (score: number) => score * 10;
    expect(calculateXP(5)).toBe(50);
  });
});
