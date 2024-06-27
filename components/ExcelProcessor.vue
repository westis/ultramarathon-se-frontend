// file path: frontend/components/ExcelProcessor.vue

<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <button class="btn mx-2 border-primary border-2" @click="verifyFile">
      Verify
    </button>
    <button class="btn mx-2 border-primary border-2" @click="convertFile">
      Convert
    </button>
    <div v-for="(result, index) in validationResults" :key="index" class="mt-2">
      <span
        :class="{
          'text-green-500': result.status === 'verified',
          'text-red-500': result.status === 'not_verified',
          'text-yellow-500': result.status === 'unknown',
        }"
      >
        <!-- Review this section if it automatically adds a check mark -->
        <span v-if="result.status === 'verified'">✅</span>
        <span v-else-if="result.status === 'not_verified'">❌</span>
        <span v-else>&#63;</span>
        {{ result.message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import { friidrottsstatistikRequirements } from "~/tools/resultsVendors/friidrottsstatistik";

interface ValidationResult {
  message: string;
  status: "verified" | "not_verified" | "unknown";
}

const uploadedFile = ref<File | null>(null);
const validationResults = ref<ValidationResult[]>([]);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    uploadedFile.value = target.files[0];
  }
};

function checkRequiredHeaders(actualHeaders: string[]): {
  isValid: boolean;
  missingHeaders: string[];
} {
  const requiredHeaders = friidrottsstatistikRequirements.requiredHeaders;
  const actualHeadersLower = actualHeaders.map((header) =>
    header.toLowerCase()
  );
  const requiredHeadersLower = requiredHeaders.map((header) =>
    header.toLowerCase()
  );

  // Explicitly type the accumulator as number[] to resolve the TypeScript error
  const missingHeadersIndex = requiredHeadersLower.reduce<number[]>(
    (acc, requiredHeader, index) => {
      if (!actualHeadersLower.includes(requiredHeader)) {
        acc.push(index); // Correctly push the index of the missing header
      }
      return acc;
    },
    []
  ); // Initial accumulator is an empty array of numbers

  const missingHeaders = missingHeadersIndex.map(
    (index) => requiredHeaders[index]
  );

  return {
    isValid: missingHeaders.length === 0,
    missingHeaders,
  };
}

function checkRequiredContent(data: any[]): {
  isValid: boolean;
  missingContentColumns: string[];
} {
  // Filter out entirely empty rows
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => value !== "")
  );

  if (!filteredData.length) {
    return { isValid: false, missingContentColumns: [] };
  }

  const mandatoryContentColumns =
    friidrottsstatistikRequirements.mandatoryContentColumns;
  let missingContentColumns = new Set<string>();

  filteredData.forEach((row, rowIndex) => {
    mandatoryContentColumns.forEach((column) => {
      // If the column is 'results' and the 'placing' value is 'DNF' or 'DNS', skip the check
      if (
        column === "results" &&
        (row["placing"] === "DNF" || row["placing"] === "DNS")
      ) {
        console.log(
          `Skipping content check for row ${rowIndex + 1}, Column ${column}`
        );
        return;
      }

      const value = row[column];

      // Check for non-empty content, explicitly considering zero as a valid value
      if (!value && value !== 0) {
        missingContentColumns.add(column);
      }
    });
  });

  return {
    isValid: missingContentColumns.size === 0,
    missingContentColumns: Array.from(missingContentColumns),
  };
}

type DataRow = Record<string, any>;

function mapArrayToObjects(headers: string[], data: any[][]): DataRow[] {
  return data.map((row: any[]): DataRow => {
    const obj: DataRow = {};
    row.forEach((value: any, index: number) => {
      const header = headers[index].toLowerCase(); // Ensure headers are in lowercase
      obj[header] = value;
    });
    return obj;
  });
}

const verifyFile = async () => {
  if (!uploadedFile.value) return;

  validationResults.value = []; // Reset previous results

  let { headers, data } = await readFile(uploadedFile.value);

  // Convert headers to lowercase to standardize them
  headers = headers.map((header) => header.toLowerCase());

  // Map array of arrays to array of objects
  data = mapArrayToObjects(headers, data);

  // Header validation
  const { isValid: headersValid, missingHeaders } =
    checkRequiredHeaders(headers);
  if (!headersValid) {
    validationResults.value.push({
      message: `Required headers missing: ${missingHeaders.join(", ")}`,
      status: "not_verified",
    });
  } else {
    validationResults.value.push({
      message: "All required headers are present",
      status: "verified",
    });
  }

  // Content check
  if (headersValid) {
    // Only proceed if headers are valid
    const { isValid: contentValid, missingContentColumns } =
      checkRequiredContent(data);
    if (!contentValid) {
      validationResults.value.push({
        message: `Columns with missing content: ${Array.from(
          missingContentColumns
        ).join(", ")}`, // Corrected here
        status: "not_verified",
      });
    } else {
      validationResults.value.push({
        message: "All required columns have content",
        status: "verified",
      });
    }
  }
};

const convertFile = () => {
  // Implement conversion logic
};

const readFile = (file: File): Promise<{ headers: string[]; data: any[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Use defval option to handle empty cells as ""
      const json = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "", // Setting default value for empty cells
      }) as string[][];

      const headers = json[0]; // Keep headers in their original case
      const dataWithoutHeaders = json.slice(1);
      resolve({ headers, data: dataWithoutHeaders });
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

const validateData = (
  data: any[],
  {
    requiredHeaders,
    mandatoryContentColumns,
  }: typeof friidrottsstatistikRequirements
) => {
  const headers = Object.keys(data[0]);
  const hasRequiredHeaders = requiredHeaders.every((header) =>
    headers.includes(header)
  );
  const hasMandatoryContent = data.every((row) =>
    mandatoryContentColumns.every(
      (column) => row[column] !== undefined && row[column] !== ""
    )
  );
  return hasRequiredHeaders && hasMandatoryContent;
};
</script>
