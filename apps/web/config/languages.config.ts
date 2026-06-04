export type LanguageConfig = {
  id: string
  label: string
  monacoLanguage: string
  fileExtension: string
  color: string
  defaultCode: string
  iconName: string
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'python',
    label: 'Python',
    monacoLanguage: 'python',
    fileExtension: 'py',
    color: '#3B82F6',
    iconName: 'code-2',
    defaultCode: `# Python
print("Hello, CodeRank!")
`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    monacoLanguage: 'javascript',
    fileExtension: 'js',
    color: '#F59E0B',
    iconName: 'code-2',
    defaultCode: `// JavaScript
console.log("Hello, CodeRank!")
`,
  },
  {
    id: 'java',
    label: 'Java',
    monacoLanguage: 'java',
    fileExtension: 'java',
    color: '#EF4444',
    iconName: 'code-2',
    defaultCode: `// Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        System.out.println(line);
    }
}
`,
  },
  {
    id: 'cpp',
    label: 'C++',
    monacoLanguage: 'cpp',
    fileExtension: 'cpp',
    color: '#8B5CF6',
    iconName: 'code-2',
    defaultCode: `// C++
#include <iostream>
#include <string>

int main() {
    std::string line;
    std::getline(std::cin, line);
    std::cout << line << std::endl;
    return 0;
}
`,
  },
]

export function getLanguageById(id: string): LanguageConfig | undefined {
  return LANGUAGES.find((l) => l.id === id)
}

export const DEFAULT_LANGUAGE_ID = 'python'
export const DEFAULT_LANGUAGE = LANGUAGES[0]
