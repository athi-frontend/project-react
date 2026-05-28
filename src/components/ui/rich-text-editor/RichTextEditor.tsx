'use client'
import React, { useEffect, useRef } from 'react'
import { Box, GlobalStyles } from '@mui/material'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useTheme } from '@mui/material/styles'
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  Link,
  List,
  BlockQuote,
  Table,
  TableToolbar,
  Indent,
  IndentBlock,
  Image,
  ImageUpload,
  ImageInsert,
  ImageStyle,
  ImageResize,
  ImageToolbar,
  ImageCaption,
  MediaEmbed,
} from 'ckeditor5';
import { EditorContainer, EditorLabel, EditorLabelContainer, ErrorTextRichText, InlineStyles, CKHeight, RichTextEditorStyles,RichTextEditorContentsCss } from '@/styles/components/ui/input'
import InfoHover from '../info-hover/InfoHover'
import 'ckeditor5/ckeditor5.css';
import { RICH_TEXT_EDITOR_CONSTANTS } from '@/constants/components/ui/richTextEditor'

/**
 * Classification: Confidential
 */

interface RichTextEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  dataSourceName?: string
  dataFieldName?: string
  infoText?: string
  toolbaroptions?: { items: [] }
  disabled?: boolean
  id?: string
  hideBorder?: boolean
  height?: string
}

const defaultConfig = {
  licenseKey: 'GPL',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'blockQuote',
      'insertTable',
      'undo',
      'redo',
    ],
  },
  plugins: [
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Heading,
    Link,
    List,
    BlockQuote,
    Table,
    TableToolbar,
    Indent,
    IndentBlock,
    Image,
    ImageUpload,
    ImageInsert,
    ImageStyle,
    ImageResize,
    ImageToolbar,
    ImageCaption,
    MediaEmbed,
  ],
  placeholder: 'Type your content here...',
}

interface FileLoader {
  file: Promise<File>
}

class Base64UploadAdapter {
  private readonly loader: FileLoader

  constructor(loader: FileLoader) {
    this.loader = loader
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({ default: reader.result })
        } else {
          reject(new Error('Failed to read file as data URL'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file) // Convert file to Base64 string
    }))
  }

  abort(): void {
    // No abort needed for this simple implementation
  }
}

function Base64UploadPlugin(editor: any): void {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
    return new Base64UploadAdapter(loader)
  }
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  dataSourceName,
  dataFieldName,
  infoText,
  toolbaroptions,
  disabled = false,
  id,
  hideBorder = false,
  height,
}) => {
  const theme = useTheme()
  const editorRef = useRef<any>(null)

  const editorConfig = {
    licenseKey: defaultConfig.licenseKey,
    toolbar: toolbaroptions ?? defaultConfig.toolbar,
    contentsCss: [
      RichTextEditorContentsCss(theme.palette.text.primary)
    ],
    ...(placeholder && { placeholder }),
    shouldNotGroupWhenFull: true, // enables overflow grouping
    plugins: defaultConfig.plugins,
    extraPlugins: [Base64UploadPlugin],
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: RICH_TEXT_EDITOR_CONSTANTS.DefaultProtocol,
    }
  }

  const handleEditorChange = (_event: any, editor: any) => {
    if (disabled) return; // Prevent changes when disabled
    const data = editor.getData()
    onChange(data)
  }

  const handleEditorReady = (editor: any) => {
    editorRef.current = editor

    // Set editor as read-only if disabled
    if (disabled) {
      editor.enableReadOnlyMode(RICH_TEXT_EDITOR_CONSTANTS.READ_ONLY_MODE_ID)
    }

    editor.editing.view.change((writer: any) => {
      writer.setStyle(RICH_TEXT_EDITOR_CONSTANTS.CSS_PROPERTIES.HEIGHT, height ?? CKHeight, editor.editing.view.document.getRoot());
    });
    editor.editing.view.change((writer: any) => {
      const editableElement = editor.editing.view.document.getRoot()
      writer.setStyle(
        'background-color',
        theme.palette.background.paper,
        editableElement
      )
      writer.setStyle('color', theme.palette.text.primary, editableElement)
      writer.setStyle(RICH_TEXT_EDITOR_CONSTANTS.CSS_PROPERTIES.PADDING, RichTextEditorStyles.editablePadding, editableElement)
      if (hideBorder) {
        writer.setStyle(RICH_TEXT_EDITOR_CONSTANTS.CSS_PROPERTIES.BORDER, RichTextEditorStyles.noBorderStyle.border, editableElement)
      }
    })
    const toolbar = editor.ui.view.toolbar.element
    toolbar.style.backgroundColor = theme.palette.background.paper
    toolbar.style.color = theme.palette.text.primary
    const buttons = toolbar.querySelectorAll('.ck-button')
    buttons.forEach((btn: any) => {
      btn.style.color = theme.palette.text.primary
    })
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    // Handle disabled state changes
    if (disabled) {
      editor.enableReadOnlyMode(RICH_TEXT_EDITOR_CONSTANTS.READ_ONLY_MODE_ID)
    } else {
      editor.disableReadOnlyMode(RICH_TEXT_EDITOR_CONSTANTS.READ_ONLY_MODE_ID)
    }

    editor.editing.view.change((writer: any) => {
      const editableElement = editor.editing.view.document.getRoot()
      writer.setStyle(
        'background-color',
        theme.palette.background.paper,
        editableElement
      )
      writer.setStyle('color', theme.palette.text.primary, editableElement)
    })

    const toolbar = editor.ui.view.toolbar.element
    toolbar.style.backgroundColor = theme.palette.background.paper
    toolbar.style.color = theme.palette.text.primary

    const buttons = toolbar.querySelectorAll('.ck-button')
    buttons.forEach((btn: any) => {
      btn.style.color = theme.palette.text.primary
    })
  }, [disabled, theme])

  return (
    <Box id={id}>
      <GlobalStyles styles={RichTextEditorStyles.globalOverrides(theme, hideBorder)} />
      <Box sx={InlineStyles.editorContainer}>
        <EditorLabelContainer>
          <EditorLabel>{label}</EditorLabel>
          {infoText && (
            <InfoHover infoText={infoText} />
          )}
        </EditorLabelContainer>
        <EditorContainer
          style={hideBorder
            ? RichTextEditorStyles.noBorderStyle
            : RichTextEditorStyles.editorContainerWithBorder(error, theme)
          }
          sx={RichTextEditorStyles.editorContainerWithHeight(height)}
        >
          <CKEditor
            editor={ClassicEditor as any}
            config={editorConfig}
            onReady={handleEditorReady}
            data={value ?? ''}
            onChange={handleEditorChange}
          />
          <input
            type="hidden"
            value={value ?? ''}
            data-sourcename={dataSourceName}
            data-fieldname={dataFieldName}
          />
        </EditorContainer>

        <ErrorTextRichText>{error}</ErrorTextRichText>
      </Box>
    </Box>
  )
}

export default RichTextEditor
