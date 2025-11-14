"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';

interface FileUploadProps {
  label: string;
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string; // e.g., ".pdf, .jpg, .png"
  maxFileSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileUpload,
  acceptedFileTypes = ".pdf, .jpg, .jpeg, .png",
  maxFileSizeMB = 5,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
        showError(`O arquivo excede o tamanho máximo de ${maxFileSizeMB}MB.`);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      showError("Por favor, selecione um arquivo para upload.");
      return;
    }

    setIsUploading(true);
    // Simulate API upload delay
    setTimeout(() => {
      setIsUploading(false);
      onFileUpload(file);
      showSuccess(`Arquivo "${file.name}" enviado com sucesso!`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const handleRemove = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showSuccess("Arquivo removido.");
  };

  return (
    <div className="space-y-2 p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-900">
      <Label className="text-sm font-medium dark:text-gray-300">{label}</Label>
      <div className="flex items-center space-x-3">
        <Input
          id="file-upload"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploading ? 'Enviando...' : 'Upload'}
        </Button>
      </div>

      {file && (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-800 border dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px] md:max-w-none">
              {file.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Tipos aceitos: {acceptedFileTypes}. Tamanho máximo: {maxFileSizeMB}MB.
      </p>
    </div>
  );
};

export default FileUpload;