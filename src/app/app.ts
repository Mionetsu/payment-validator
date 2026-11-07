import { Component, computed, signal } from '@angular/core';
import { buildWorkbookData, readRows } from './services/excel';
import { COLUMNS, processRows, STATUS_LABELS } from './services/payment-processor';
import type { RawRow } from './models/validation.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly candidate = {
    name: 'Oscar Jared Alvarez Camarena',
    github: 'https://github.com/Mionetsu',
    linkedin: 'https://www.linkedin.com/in/oskarjareda/',
  };
  protected readonly profile = {
    role: 'Desarrollador front-end',
    summary:
      '6 años de experiencia en desarrollo de software, con enfoque en front-end web y una base sólida en JavaScript.',
    skills: ['Angular', 'TypeScript', 'React', 'Vue.js', 'JavaScript', 'SQL', 'Python', 'Git'],
  };
  protected readonly isFlipped = signal(false);
  
  protected toggleCard(): void {
    this.isFlipped.update((flipped) => !flipped);
  }

  protected readonly statusColumn = COLUMNS.status;
  protected readonly errorColumn = COLUMNS.errorMessage;
  protected readonly validLabel = STATUS_LABELS.valid;
  protected readonly amountColumn = COLUMNS.amount;

  protected readonly rows = signal<RawRow[]>([]);
  protected readonly fileName = signal('');
  protected readonly errorMessage = signal('');
  protected readonly isDragging = signal(false);

  protected readonly columns = computed(() => {
    const [firstRow] = this.rows();
    return firstRow ? Object.keys(firstRow) : [];
  });

  protected readonly validCount = computed(
    () => this.rows().filter((row) => row[COLUMNS.status] === STATUS_LABELS.valid).length,
  );

  protected readonly invalidCount = computed(() => this.rows().length - this.validCount());

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      await this.loadFile(file);
    }

    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(): void {
    this.isDragging.set(false);
  }

  protected async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files[0];

    if (file) {
      await this.loadFile(file);
    }
  }

  protected exportFile(): void {
    const data = buildWorkbookData(this.rows());

    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'resultado.xlsx';
    link.click();

    URL.revokeObjectURL(url);
  }

  private async loadFile(file: File): Promise<void> {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.errorMessage.set('El archivo debe ser un Excel (.xlsx).');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      this.rows.set(processRows(readRows(buffer)));
      this.fileName.set(file.name);
      this.errorMessage.set('');
    } catch {
      this.rows.set([]);
      this.fileName.set('');
      this.errorMessage.set('No se pudo leer el archivo. Verifica que sea un .xlsx válido.');
    }
  }
}

