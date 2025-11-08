using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        string filePath = "students.txt"; // Путь к файлу (убедись, что он в output-директории)

        if (!File.Exists(filePath))
        {
            Console.WriteLine("Файл students.txt не найден!");
            return;
        }

        List<Student> students = new List<Student>();

        // Чтение файла
        foreach (string line in File.ReadLines(filePath))
        {
            string[] parts = line.Split(';');
            if (parts.Length == 6)
            {
                string fio = parts[0];
                string group = parts[1];
                List<int> grades = new List<int>();
                for (int i = 2; i < 6; i++)
                {
                    if (int.TryParse(parts[i], out int grade) && grade >= 1 && grade <= 5)
                    {
                        grades.Add(grade);
                    }
                    else
                    {
                        Console.WriteLine($"Ошибка в оценках для {fio}: {parts[i]} не является корректной оценкой (1-5).");
                        return;
                    }
                }
                students.Add(new Student(fio, group, grades));
            }
            else
            {
                Console.WriteLine($"Ошибка в строке: {line}. Ожидается 6 полей, разделенных ';'.");
            }
        }

        if (students.Count < 5)
        {
            Console.WriteLine("В файле менее 5 студентов!");
            return;
        }

        // Расчет общего среднего балла всех студентов
        double totalAverage = students.Average(s => s.AverageGrade);
        Console.WriteLine($"Общий средний балл всех студентов: {totalAverage:F2}");

        // Группировка по группам и расчет среднего по группе
        var groupAverages = students.GroupBy(s => s.Group)
                                    .ToDictionary(g => g.Key, g => g.Average(s => s.AverageGrade));

        Console.WriteLine("\nСтуденты, чей средний балл выше среднего по группе:");
        foreach (var student in students)
        {
            double groupAverage = groupAverages[student.Group];
            if (student.AverageGrade > groupAverage)
            {
                Console.WriteLine($"{student.FIO} (Группа: {student.Group}) - Средний балл: {student.AverageGrade:F2} > Средний по группе: {groupAverage:F2}");
            }
        }

        Console.ReadLine(); // Для паузы в консоли
    }
}

class Student
{
    public string FIO { get; }
    public string Group { get; }
    public List<int> Grades { get; }
    public double AverageGrade { get; }

    public Student(string fio, string group, List<int> grades)
    {
        FIO = fio;
        Group = group;
        Grades = grades;
        AverageGrade = grades.Average();
    }
}