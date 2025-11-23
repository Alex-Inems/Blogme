import { exportPostsToJSON, exportPostsToCSV, exportPostsToMarkdown } from '../exportUtils';

// Mock DOM methods
beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();
  global.Blob = jest.fn((content: unknown, options?: BlobPropertyBag) => ({ content, options })) as jest.MockedClass<typeof Blob>;
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

describe('exportPostsToJSON', () => {

  it('should create and download JSON file', () => {
    const posts = [
      { title: 'Test Post', author: 'Test Author', content: 'Test content' },
    ];

    const createElementSpy = jest.spyOn(document, 'createElement');
    exportPostsToJSON(posts, 'test.json');

    expect(global.Blob).toHaveBeenCalled();
    expect(createElementSpy).toHaveBeenCalledWith('a');
    createElementSpy.mockRestore();
  });

  it('should use default filename if not provided', () => {
    const posts = [{ title: 'Test' }];
    exportPostsToJSON(posts);
    expect(global.Blob).toHaveBeenCalled();
  });
});

describe('exportPostsToCSV', () => {

  it('should return early for empty posts array', () => {
    exportPostsToCSV([], 'test.csv');
    expect(global.Blob).not.toHaveBeenCalled();
  });

  it('should create CSV with headers', () => {
    const posts = [
      {
        title: 'Test Post',
        content: 'Test content',
        author: 'Test Author',
        category: 'Tech',
        tags: ['tag1', 'tag2'],
        createdAt: { toDate: () => new Date('2024-01-01') },
        published: true,
        readingTime: 5,
        views: 100,
        likes: 10,
      },
    ];

    exportPostsToCSV(posts, 'test.csv');

    expect(global.Blob).toHaveBeenCalled();
    const blobCall = (global.Blob as jest.Mock).mock.calls[(global.Blob as jest.Mock).mock.calls.length - 1];
    const csvContent = blobCall[0][0];
    expect(csvContent).toContain('Title,Content,Author');
    expect(csvContent).toContain('Test Post');
  });

  it('should handle posts with string createdAt', () => {
    const posts = [
      {
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    exportPostsToCSV(posts, 'test.csv');
    expect(global.Blob).toHaveBeenCalled();
  });

  it('should handle posts with number createdAt', () => {
    const posts = [
      {
        title: 'Test',
        createdAt: 1704067200000,
      },
    ];

    exportPostsToCSV(posts, 'test.csv');
    expect(global.Blob).toHaveBeenCalled();
  });

  it('should handle missing createdAt', () => {
    const posts = [
      {
        title: 'Test',
      },
    ];

    exportPostsToCSV(posts, 'test.csv');
    expect(global.Blob).toHaveBeenCalled();
  });

  it('should escape quotes in content', () => {
    const posts = [
      {
        title: 'Test',
        content: 'Content with "quotes"',
      },
    ];

    exportPostsToCSV(posts, 'test.csv');
    const blobCall = (global.Blob as jest.Mock).mock.calls[(global.Blob as jest.Mock).mock.calls.length - 1];
    const csvContent = blobCall[0][0];
    expect(csvContent).toContain('""quotes""');
  });

  it('should handle tags array', () => {
    const posts = [
      {
        title: 'Test',
        tags: ['tag1', 'tag2'],
      },
    ];

    exportPostsToCSV(posts, 'test.csv');
    const blobCall = (global.Blob as jest.Mock).mock.calls[(global.Blob as jest.Mock).mock.calls.length - 1];
    const csvContent = blobCall[0][0];
    expect(csvContent).toContain('tag1; tag2');
  });
});

describe('exportPostsToMarkdown', () => {

  it('should create markdown file', () => {
    const posts = [
      {
        title: 'Test Post',
        content: 'Test content',
        author: 'Test Author',
        category: 'Tech',
        tags: ['tag1', 'tag2'],
        createdAt: { toDate: () => new Date('2024-01-01') },
        published: true,
        readingTime: 5,
        views: 100,
        likes: 10,
      },
    ];

    exportPostsToMarkdown(posts, 'test.md');

    expect(global.Blob).toHaveBeenCalled();
    const blobCall = (global.Blob as jest.Mock).mock.calls[(global.Blob as jest.Mock).mock.calls.length - 1];
    const markdownContent = blobCall[0][0];
    expect(markdownContent).toContain('# Test Post');
    expect(markdownContent).toContain('**Author:** Test Author');
    expect(markdownContent).toContain('#tag1 #tag2');
  });

  it('should handle posts with missing fields', () => {
    const posts = [
      {
        title: 'Test',
      },
    ];

    exportPostsToMarkdown(posts, 'test.md');
    const blobCall = (global.Blob as jest.Mock).mock.calls[(global.Blob as jest.Mock).mock.calls.length - 1];
    const markdownContent = blobCall[0][0];
    expect(markdownContent).toContain('# Test');
    expect(markdownContent).toContain('**Author:** Unknown');
  });

  it('should handle multiple posts', () => {
    const posts = [
      { title: 'Post 1', content: 'Content 1' },
      { title: 'Post 2', content: 'Content 2' },
    ];

    exportPostsToMarkdown(posts, 'test.md');
    const blobCall = (global.Blob as jest.Mock).mock.calls[(global.Blob as jest.Mock).mock.calls.length - 1];
    const markdownContent = blobCall[0][0];
    expect(markdownContent).toContain('# Post 1');
    expect(markdownContent).toContain('# Post 2');
  });
});

