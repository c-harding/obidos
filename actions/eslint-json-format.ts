export interface Fix {
  range: number[];
  text: string;
}

export interface Message {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  messageId: string;
  endLine: number;
  endColumn: number;
  fix?: Fix;
}

export interface ESLintFileReport {
  filePath: string;
  messages: Message[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  source: string;
}
