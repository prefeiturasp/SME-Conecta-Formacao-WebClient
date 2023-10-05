import { Jodit } from 'jodit/types/jodit';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface IJoditEditorProps {
  value?: string;
  config?: DeepPartial<Jodit['options']> & {
    spellcheck?: boolean;
    askBeforePasteFromWord?: boolean;
    askBeforePasteHTML?: boolean;
    enableDragAndDropFileToEditor?: boolean;
    showWordsCounter?: boolean;
    showXPathInStatusbar?: boolean;
    uploader?: DeepPartial<Jodit['uploader']['options']>;
    placeholder?: string;
    popup?: any;
  };
  onChange?: (newValue?: string) => void;
  onBlur?: (newValue?: string) => void;
}
