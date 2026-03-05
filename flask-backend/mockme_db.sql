-- ============================================================
-- MockMe Database Setup Script
-- Database: mockme
-- Run this in MySQL / phpMyAdmin to recreate the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS `mockme`;
USE `mockme`;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE: questions
-- ============================================================
CREATE TABLE IF NOT EXISTS `questions` (
    `question_id` INT AUTO_INCREMENT PRIMARY KEY,
    `question` TEXT NOT NULL,
    `domain` VARCHAR(100) NOT NULL,
    `sample_answer` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE: answers
-- ============================================================
CREATE TABLE IF NOT EXISTS `answers` (
    `answer_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `answer_text` TEXT,
    `timestamp` VARCHAR(50),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- SEED DATA: questions
-- Domain: Data Structures & Algorithm
-- ============================================================
INSERT INTO `questions` (`question`, `domain`, `sample_answer`) VALUES

-- Data Structures & Algorithm (15 questions)
('What is a data structure?', 'Data Structures & Algorithm',
 'A data structure is a way of organizing and storing data in a computer so that it can be accessed and modified efficiently. Examples include arrays, linked lists, stacks, queues, trees, and graphs. Choosing the right data structure is crucial for writing efficient algorithms.'),

('Explain the difference between an array and a linked list.', 'Data Structures & Algorithm',
 'An array stores elements in contiguous memory locations and allows O(1) random access using index, but has fixed size and costly insertions/deletions. A linked list stores elements as nodes connected via pointers, allowing O(1) insertions/deletions at known positions, but requires O(n) time for random access since elements are not stored contiguously.'),

('What is a stack and where is it used?', 'Data Structures & Algorithm',
 'A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Elements are added and removed from the same end called the top. Stacks are used in function call management (call stack), expression evaluation, undo operations in editors, backtracking algorithms, and browser history navigation.'),

('What is a queue? Explain its types.', 'Data Structures & Algorithm',
 'A queue is a linear data structure following the First In First Out (FIFO) principle. Elements are added at the rear and removed from the front. Types include: Simple Queue (basic FIFO), Circular Queue (rear connects back to front), Priority Queue (elements dequeued by priority), and Double-Ended Queue or Deque (insertion and deletion at both ends).'),

('Explain the concept of recursion with an example.', 'Data Structures & Algorithm',
 'Recursion is a technique where a function calls itself to solve a problem by breaking it into smaller subproblems. Each recursive call should move toward a base case to avoid infinite loops. For example, calculating factorial: factorial(n) = n * factorial(n-1) with base case factorial(0) = 1. Recursion is used in tree traversals, divide and conquer algorithms, and backtracking.'),

('What is a binary tree and what are its types?', 'Data Structures & Algorithm',
 'A binary tree is a hierarchical data structure where each node has at most two children called left and right child. Types include: Full Binary Tree (every node has 0 or 2 children), Complete Binary Tree (all levels filled except possibly the last), Perfect Binary Tree (all internal nodes have 2 children and all leaves are at the same level), and Balanced Binary Tree (height difference between subtrees is at most 1).'),

('What is the time complexity of common sorting algorithms?', 'Data Structures & Algorithm',
 'Bubble Sort has O(n²) average and worst case. Selection Sort has O(n²) in all cases. Insertion Sort has O(n) best case and O(n²) worst case. Merge Sort has O(n log n) in all cases. Quick Sort has O(n log n) average and O(n²) worst case. Heap Sort has O(n log n) in all cases. The choice of sorting algorithm depends on data size, memory constraints, and whether stability is required.'),

('Explain the concept of hashing and hash tables.', 'Data Structures & Algorithm',
 'Hashing is a technique that maps data of arbitrary size to fixed-size values using a hash function. A hash table uses this to store key-value pairs, providing O(1) average-case time for insertion, deletion, and search. Collisions occur when two keys map to the same index, handled through techniques like chaining (linked lists at each index) or open addressing (probing for next available slot).'),

('What is a graph and how is it represented?', 'Data Structures & Algorithm',
 'A graph is a non-linear data structure consisting of vertices (nodes) and edges connecting them. Graphs can be directed or undirected, weighted or unweighted. They are represented using: Adjacency Matrix (2D array where matrix[i][j] indicates an edge), Adjacency List (array of linked lists where each list contains neighbors), or Edge List (list of all edges as pairs). Adjacency lists are more space-efficient for sparse graphs.'),

('Explain BFS and DFS traversal algorithms.', 'Data Structures & Algorithm',
 'BFS (Breadth-First Search) explores all neighbors at the current depth before moving to the next level. It uses a queue and finds the shortest path in unweighted graphs. DFS (Depth-First Search) explores as far as possible along each branch before backtracking. It uses a stack or recursion. BFS is suitable for shortest path problems while DFS is preferred for topological sorting, cycle detection, and solving puzzles.'),

('What is dynamic programming? Give an example.', 'Data Structures & Algorithm',
 'Dynamic programming is an optimization technique that solves complex problems by breaking them into overlapping subproblems and storing their solutions to avoid redundant computations. It uses two approaches: top-down (memoization with recursion) and bottom-up (tabulation with iteration). A classic example is the Fibonacci sequence where DP stores previously computed values, reducing time complexity from O(2^n) to O(n).'),

('What is the difference between a min-heap and a max-heap?', 'Data Structures & Algorithm',
 'A heap is a complete binary tree that satisfies the heap property. In a min-heap, the parent node is always smaller than or equal to its children, so the minimum element is at the root. In a max-heap, the parent is always greater than or equal to its children, so the maximum element is at the root. Heaps are used in priority queues, heap sort, and finding kth largest/smallest elements.'),

('What is a balanced binary search tree?', 'Data Structures & Algorithm',
 'A balanced BST is a binary search tree where the height difference between left and right subtrees of every node is at most 1. This ensures O(log n) time for search, insert, and delete operations. Examples include AVL trees (strictly balanced using rotation operations) and Red-Black trees (loosely balanced using color properties). Without balancing, a BST can degenerate into a linked list with O(n) operations.'),

('Explain the greedy algorithm approach.', 'Data Structures & Algorithm',
 'A greedy algorithm makes the locally optimal choice at each step with the hope of finding a global optimum. It does not reconsider previous choices. Greedy works when the problem has optimal substructure and the greedy choice property. Examples include Dijkstra''s shortest path algorithm, Huffman coding, Kruskal''s and Prim''s minimum spanning tree algorithms, and the activity selection problem.'),

('What is the difference between a tree and a graph?', 'Data Structures & Algorithm',
 'A tree is a special type of graph that is connected and acyclic (no cycles). It has exactly n-1 edges for n nodes and a unique path between any two nodes. A graph can have cycles, may be disconnected, and can have any number of edges. Trees have a hierarchical structure with a root node, while graphs have a more general network structure. Every tree is a graph, but not every graph is a tree.'),


-- ============================================================
-- Domain: Database Management System (15 questions)
-- ============================================================
('What is a database management system (DBMS)?', 'Database Management System',
 'A DBMS is system software that manages the creation, maintenance, and use of databases. It provides an interface between users and databases, handles data storage, retrieval, and update operations. Key features include data independence, data integrity, concurrency control, backup and recovery, and security. Examples include MySQL, PostgreSQL, Oracle, and MongoDB.'),

('Explain the difference between SQL and NoSQL databases.', 'Database Management System',
 'SQL databases are relational, use structured query language, have predefined schemas, and store data in tables with rows and columns. They ensure ACID properties. Examples: MySQL, PostgreSQL. NoSQL databases are non-relational, have flexible schemas, and store data in documents, key-value pairs, wide columns, or graphs. They prioritize scalability and performance over strict consistency. Examples: MongoDB, Cassandra, Redis.'),

('What is normalization? Explain its forms.', 'Database Management System',
 'Normalization is the process of organizing data in a database to reduce redundancy and dependency. 1NF ensures each column contains atomic values. 2NF removes partial dependencies (non-key attributes depend on the entire primary key). 3NF removes transitive dependencies (non-key attributes depend only on the primary key). BCNF is a stricter form of 3NF where every determinant is a candidate key. Normalization improves data integrity but may reduce query performance.'),

('What are primary keys and foreign keys?', 'Database Management System',
 'A primary key is a column or set of columns that uniquely identifies each row in a table. It cannot contain NULL values and must be unique. A foreign key is a column that creates a link between two tables by referencing the primary key of another table. It enforces referential integrity, ensuring that relationships between tables remain consistent. A table can have only one primary key but multiple foreign keys.'),

('Explain ACID properties in databases.', 'Database Management System',
 'ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity ensures a transaction is treated as a single unit that either completes entirely or not at all. Consistency ensures the database moves from one valid state to another. Isolation ensures concurrent transactions do not interfere with each other. Durability ensures that once a transaction is committed, the changes persist even in case of system failure.'),

('What is an index in a database? Why is it important?', 'Database Management System',
 'An index is a data structure that improves the speed of data retrieval operations on a table at the cost of additional storage and slower write operations. It works like a book''s index, allowing the database to find rows without scanning the entire table. Types include B-tree indexes (default, good for range queries), Hash indexes (equality comparisons), and Composite indexes (multiple columns). Proper indexing is crucial for query optimization.'),

('Explain the different types of JOIN operations.', 'Database Management System',
 'JOIN operations combine rows from two or more tables based on related columns. INNER JOIN returns rows with matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right. RIGHT JOIN returns all rows from the right table and matched rows from the left. FULL OUTER JOIN returns all rows when there is a match in either table. CROSS JOIN returns the Cartesian product of both tables.'),

('What is a stored procedure?', 'Database Management System',
 'A stored procedure is a precompiled set of SQL statements stored in the database that can be executed as a single unit. It accepts parameters, performs operations, and can return results. Benefits include improved performance (precompiled execution plan), code reusability, reduced network traffic, and enhanced security through controlled data access. Stored procedures help encapsulate business logic at the database level.'),

('What is a transaction in a database?', 'Database Management System',
 'A transaction is a logical unit of work that consists of one or more SQL operations executed as a single unit. It follows ACID properties. A transaction begins with a start statement and ends with either a COMMIT (save changes permanently) or ROLLBACK (undo all changes). Transactions ensure data integrity in multi-user environments and protect against partial updates during system failures.'),

('Explain the concept of database views.', 'Database Management System',
 'A view is a virtual table based on the result of a SELECT query. It does not store data physically but provides a way to simplify complex queries, restrict data access, and present data in a specific format. Views can be used for security by exposing only certain columns, for abstraction by hiding table complexity, and for consistency by providing a stable interface even when underlying tables change.'),

('What is denormalization and when is it used?', 'Database Management System',
 'Denormalization is the process of intentionally adding redundancy to a normalized database to improve read performance. It involves combining tables, adding derived columns, or duplicating data to reduce the number of JOIN operations needed for queries. Denormalization is used when read performance is critical, in data warehousing and reporting systems, and when the cost of redundancy is acceptable compared to the performance gain.'),

('Explain the concept of database triggers.', 'Database Management System',
 'A trigger is a special type of stored procedure that automatically executes in response to specific events on a table, such as INSERT, UPDATE, or DELETE operations. Triggers can fire BEFORE or AFTER the event. They are used for enforcing complex business rules, maintaining audit trails, automatically updating related tables, and validating data beyond simple constraints. However, excessive triggers can impact performance.'),

('What is database sharding?', 'Database Management System',
 'Database sharding is a horizontal scaling technique that distributes data across multiple database instances called shards. Each shard contains a subset of the total data, determined by a shard key. Sharding improves performance by distributing query load, increases storage capacity beyond single-server limits, and provides fault isolation. Common strategies include range-based, hash-based, and directory-based sharding.'),

('What is the difference between DELETE, TRUNCATE, and DROP?', 'Database Management System',
 'DELETE removes specific rows based on a WHERE condition and can be rolled back. It fires triggers and is logged row by row. TRUNCATE removes all rows from a table but keeps the table structure. It is faster than DELETE, cannot use WHERE, and resets identity columns. DROP completely removes the table including its structure, data, indexes, and constraints from the database. It is irreversible and frees up storage space entirely.'),

('What are aggregate functions in SQL?', 'Database Management System',
 'Aggregate functions perform calculations on a set of values and return a single result. Common aggregate functions include: COUNT (number of rows), SUM (total of numeric values), AVG (average of numeric values), MAX (largest value), and MIN (smallest value). They are typically used with the GROUP BY clause to group results and the HAVING clause to filter grouped results. They ignore NULL values except COUNT(*).'),


-- ============================================================
-- Domain: Software Engineering (15 questions)
-- ============================================================
('What is software engineering?', 'Software Engineering',
 'Software engineering is the systematic application of engineering principles to the design, development, testing, deployment, and maintenance of software. It involves using well-defined methodologies, tools, and practices to produce reliable, efficient, and maintainable software within time and budget constraints. It covers the entire software development lifecycle from requirements gathering to maintenance.'),

('Explain the Software Development Life Cycle (SDLC).', 'Software Engineering',
 'SDLC is a structured process for developing software that includes several phases: Requirements Gathering (understanding what the software should do), System Design (architecture and technical specifications), Implementation (coding), Testing (verification and validation), Deployment (releasing to users), and Maintenance (bug fixes and updates). Different SDLC models include Waterfall, Agile, Spiral, and V-Model.'),

('What is the difference between Agile and Waterfall models?', 'Software Engineering',
 'Waterfall is a sequential, linear approach where each phase must be completed before the next begins. It works well for projects with clear, fixed requirements. Agile is an iterative, incremental approach that delivers software in small, working pieces called sprints. It embraces change, involves continuous customer feedback, and promotes collaboration. Agile is better for dynamic requirements while Waterfall suits well-defined projects.'),

('What are design patterns? Name some common ones.', 'Software Engineering',
 'Design patterns are proven, reusable solutions to commonly occurring problems in software design. They are categorized into three types: Creational (Singleton, Factory, Builder, Prototype), Structural (Adapter, Decorator, Facade, Proxy), and Behavioral (Observer, Strategy, Command, Iterator). Design patterns improve code reusability, maintainability, and communication among developers by providing a common vocabulary.'),

('Explain the concept of Object-Oriented Programming (OOP).', 'Software Engineering',
 'OOP is a programming paradigm based on the concept of objects that contain data (attributes) and code (methods). The four fundamental principles are: Encapsulation (bundling data and methods, hiding internal details), Abstraction (showing only essential features), Inheritance (creating new classes from existing ones), and Polymorphism (objects of different classes responding to the same method call differently). OOP promotes code reuse and modularity.'),

('What is version control and why is it important?', 'Software Engineering',
 'Version control is a system that tracks changes to files over time, allowing developers to revert to previous versions, compare changes, and collaborate effectively. It is important because it enables team collaboration without conflicts, maintains a complete history of changes, allows branching and merging for parallel development, and provides backup and recovery. Git is the most widely used version control system.'),

('What is the difference between functional and non-functional requirements?', 'Software Engineering',
 'Functional requirements describe what the system should do — specific behaviors, features, and functions. Examples: user login, generating reports, processing payments. Non-functional requirements describe how the system should perform — qualities and constraints. Examples: performance (response time under 2 seconds), security (data encryption), scalability (support 10000 concurrent users), reliability (99.9% uptime), and usability (intuitive interface).'),

('Explain the concept of software testing and its types.', 'Software Engineering',
 'Software testing is the process of evaluating software to find defects and ensure it meets requirements. Types include: Unit Testing (individual components), Integration Testing (combined modules), System Testing (complete system), Acceptance Testing (user validation), Regression Testing (ensuring changes don''t break existing features), Performance Testing (speed and scalability), and Security Testing (vulnerability assessment).'),

('What is continuous integration and continuous deployment (CI/CD)?', 'Software Engineering',
 'CI/CD is a set of practices that automate the software delivery process. Continuous Integration involves automatically building and testing code changes as they are committed to a shared repository. Continuous Deployment automatically releases validated changes to production. Benefits include faster feedback loops, reduced manual errors, quicker release cycles, and improved code quality. Tools include Jenkins, GitHub Actions, and GitLab CI.'),

('What is the SOLID principle in software design?', 'Software Engineering',
 'SOLID is an acronym for five design principles: Single Responsibility Principle (a class should have one reason to change), Open/Closed Principle (open for extension, closed for modification), Liskov Substitution Principle (subtypes must be substitutable for their base types), Interface Segregation Principle (prefer specific interfaces over general ones), and Dependency Inversion Principle (depend on abstractions, not concrete implementations).'),

('What is an API and how does a REST API work?', 'Software Engineering',
 'An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. A REST API follows Representational State Transfer principles using standard HTTP methods: GET (retrieve), POST (create), PUT (update), DELETE (remove). REST APIs are stateless, use standard URLs for resources, and typically exchange data in JSON format. They enable scalable, loosely-coupled systems.'),

('Explain the MVC architecture pattern.', 'Software Engineering',
 'MVC (Model-View-Controller) is an architectural pattern that separates an application into three components: Model (data and business logic, interacts with database), View (user interface, displays data), and Controller (handles user input, coordinates Model and View). This separation of concerns improves maintainability, enables parallel development, and makes testing easier. Frameworks like Django, Rails, and Spring MVC implement this pattern.'),

('What is code refactoring?', 'Software Engineering',
 'Code refactoring is the process of restructuring existing code without changing its external behavior. The goal is to improve code readability, reduce complexity, and enhance maintainability. Common refactoring techniques include extracting methods, renaming variables for clarity, removing duplicate code, simplifying conditional logic, and applying design patterns. Refactoring should be done incrementally alongside proper testing to avoid introducing bugs.'),

('What is microservices architecture?', 'Software Engineering',
 'Microservices architecture decomposes an application into small, independent services that communicate over a network, typically via REST APIs or message queues. Each service is responsible for a specific business capability, can be developed and deployed independently, and can use different technologies. Benefits include scalability, fault isolation, easier maintenance, and team autonomy. Challenges include network complexity, data consistency, and operational overhead.'),

('What is technical debt?', 'Software Engineering',
 'Technical debt refers to the implied cost of future rework caused by choosing quick, easy solutions over better approaches that would take longer. It accumulates when teams take shortcuts in design, coding, testing, or documentation. Like financial debt, it incurs interest in the form of increased maintenance effort, slower development, and higher bug rates. Managing technical debt involves regular refactoring, code reviews, and prioritizing quality.');

