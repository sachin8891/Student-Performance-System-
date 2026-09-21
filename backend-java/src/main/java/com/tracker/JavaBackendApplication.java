package com.tracker;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.tracker.model.Student;
import com.tracker.service.StudentService;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class JavaBackendApplication {
    private static final int PORT = 8080;
    private static final StudentService studentService = new StudentService();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        System.out.println("[Java Backend] Initializing Java REST Service on port " + PORT + "...");

        // Health endpoint
        server.createContext("/api/java/health", exchange -> {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String response = "{\"status\":\"healthy\",\"service\":\"Java Student Performance Service\",\"version\":\"1.0.0\"}";
            sendJsonResponse(exchange, 200, response);
        });

        // Students endpoint
        server.createContext("/api/java/students", exchange -> {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String path = exchange.getRequestURI().getPath();
            // Check if student ID is specified: /api/java/students/1
            String[] parts = path.split("/");
            if (parts.length > 4) {
                try {
                    int id = Integer.parseInt(parts[4]);
                    Student s = studentService.getStudentById(id);
                    if (s != null) {
                        sendJsonResponse(exchange, 200, s.toJson());
                    } else {
                        sendJsonResponse(exchange, 404, "{\"error\":\"Student not found\"}");
                    }
                    return;
                } catch (NumberFormatException ignored) {}
            }

            List<Student> students = studentService.getAllStudents();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < students.size(); i++) {
                sb.append(students.get(i).toJson());
                if (i < students.size() - 1) sb.append(",");
            }
            sb.append("]");
            sendJsonResponse(exchange, 200, sb.toString());
        });

        server.setExecutor(null);
        server.start();
        System.out.println("[Java Backend] Server successfully listening at http://localhost:" + PORT + "/api/java/students");
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
