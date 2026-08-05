import { useRef, useState } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import * as pdfjslib from 'pdfjs-dist';

pdfjslib.GlobalWorkerOptions.workerSrc = `https://cloudflare.com${pdfjslib.version}/pdf.worker.min.mjs`;

interface ResumeDropzoneProps {
  onTextExtracted: (text: string) => void;
}

export function ResumeDropzone({ onTextExtracted }: ResumeDropzoneProps) {
  const openRef = useRef<() => void>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState<boolean>(false);

  const parsePdfText = async (file: File) => {
    setFileName(file.name);
    setParsing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjslib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
        onTextExtracted(fullText);
      }
    } catch (err) {
      console.error('Failed to parse text vectors from uploaded PDF:', err);
    } finally {
      setParsing(false);
    }
  };

  return (
    <Stack align='center' gap='md' my='xl' style={{ width: '100%', position: 'relative', marginBottom: '30px' }}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => {
          if (files[0]) parsePdfText(files[0]);
        }}
        radius='md'
        accept={[MIME_TYPES.pdf]}
        maxSize={30 * 1024 ** 2}
        aria-label='Drop your resume here.'
        loading={parsing}
        style={{ borderWidth: '1px', paddingBottom: '50px', color: 'var(--mantine-color-bright)' }}>
        <div style={{ pointerEvents: 'none' }}>
          <Group justify='center'>
            <Dropzone.Accept>
              <IconDownload size={50} color='blue' stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color='red' stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} style={{ color: 'light-dark(var(--mantine-color-gray-4), var(--mantine-color-white))' }} />
            </Dropzone.Idle>
          </Group>

          <Text ta='center' fw={700} fz='lg' mt='xl'>
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>PDF File less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>{fileName ? `Active File: ${fileName}` : 'Upload Resume'}</Dropzone.Idle>
          </Text>

          <Text style={{ textAlign: 'center', fontSize: 'var(--mantine-font-size-sm', color: 'var(--mantine-color-dimmed)', marginTop: 'var(--mantine-spacing-xs)' }}>
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that are less than 30mb in size.
          </Text>
        </div>
      </Dropzone>
      <Button size='md' radius='xl' onClick={() => openRef.current?.()} style={{ position: 'absolute', width: '250px', left: 'calc(50% - 125px)', bottom: '-20px' }}>
        {fileName ? 'Change Resume File' : 'Select Files'}
      </Button>
    </Stack>
  );
}
