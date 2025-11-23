import { render } from '@testing-library/react';
import Container from '../Container';

describe('Container', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Container>
        <div>Test Content</div>
      </Container>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply container classes', () => {
    const { container } = render(
      <Container>
        <div>Test</div>
      </Container>
    );

    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass('container', 'mx-auto', 'px-4');
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <Container>
        <div>Child 1</div>
        <div>Child 2</div>
      </Container>
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });
});

