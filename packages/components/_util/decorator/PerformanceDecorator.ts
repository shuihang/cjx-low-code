/**
 * 性能监控装饰器
 * 用于监控方法的执行时间，当执行时间超过阈值时输出警告日志
 */

/**
 * 性能监控配置选项
 */
export interface PerformanceMonitorOptions {
  /**
   * 执行时间阈值（毫秒），超过此值将输出警告日志
   * 默认值：1000 毫秒
   */
  threshold?: number;
  
  /**
   * 是否在控制台输出性能日志
   * 默认值：true
   */
  log?: boolean;
  
  /**
   * 是否将性能数据发送到监控系统
   * 默认值：false
   */
  report?: boolean;
  
  /**
   * 自定义日志前缀
   * 默认值："Performance Monitor"
   */
  prefix?: string;
}

/**
 * 性能监控装饰器
 * @param options 性能监控配置选项
 * @returns 装饰器函数
 */
export function MeasurePerformance(options: PerformanceMonitorOptions = {}): MethodDecorator {
  // 设置默认配置
  const {
    threshold = 1000,
    log = true,
    report = false,
    prefix = "Performance Monitor"
  } = options;

  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    // 保存原始方法
    const originalMethod = descriptor.value;

    // 重写方法
    descriptor.value = function(...args: any[]) {
      // 记录开始时间
      const startTime = performance.now();
      
      try {
        // 执行原始方法
        const result = originalMethod.apply(this, args);
        
        // 如果是 Promise，等待 Promise 完成后计算时间
        if (result instanceof Promise) {
          return result.then(res => {
            // 记录结束时间
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            
            // 输出性能日志
            logPerformance(
              target, 
              propertyKey, 
              executionTime, 
              threshold, 
              log, 
              prefix
            );
            
            // 报告性能数据
            if (report) {
              reportPerformance(
                target, 
                propertyKey, 
                executionTime
              );
            }
            
            return res;
          });
        } else {
          // 记录结束时间
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          
          // 输出性能日志
          logPerformance(
            target, 
            propertyKey, 
            executionTime, 
            threshold, 
            log, 
            prefix
          );
          
          // 报告性能数据
          if (report) {
            reportPerformance(
              target, 
              propertyKey, 
              executionTime
            );
          }
          
          return result;
        }
      } catch (error) {
        // 记录结束时间（即使发生错误）
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // 输出错误性能日志
        if (log) {
          console.error(
            `${prefix} - ${getClassName(target)}.${String(propertyKey)} - Error:`,
            error,
            `Execution time: ${executionTime.toFixed(2)}ms`
          );
        }
        
        // 报告错误性能数据
        if (report) {
          reportPerformance(
            target, 
            propertyKey, 
            executionTime,
            error
          );
        }
        
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 获取类名
 * @param target 目标对象
 * @returns 类名
 */
function getClassName(target: any): string {
  if (target.constructor && target.constructor.name) {
    return target.constructor.name;
  } else if (typeof target === 'function') {
    return target.name || 'Anonymous';
  }
  return 'Unknown';
}

/**
 * 输出性能日志
 * @param target 目标对象
 * @param propertyKey 方法名
 * @param executionTime 执行时间（毫秒）
 * @param threshold 阈值（毫秒）
 * @param log 是否输出日志
 * @param prefix 日志前缀
 */
function logPerformance(
  target: any, 
  propertyKey: string | symbol, 
  executionTime: number, 
  threshold: number, 
  log: boolean, 
  prefix: string
): void {
  if (!log) return;
  
  const className = getClassName(target);
  const methodName = String(propertyKey);
  const timeStr = `${executionTime.toFixed(2)}ms`;
  
  // 只在执行时间超过阈值时输出日志
  if (executionTime > threshold) {
    console.warn(
      `${prefix} - WARNING: ${className}.${methodName} took ${timeStr} (threshold: ${threshold}ms)`
    );
  }
}

/**
 * 报告性能数据
 * @param target 目标对象
 * @param propertyKey 方法名
 * @param executionTime 执行时间（毫秒）
 * @param error 错误信息（可选）
 */
function reportPerformance(
  target: any, 
  propertyKey: string | symbol, 
  executionTime: number, 
  error?: any
): void {
  // 这里可以实现将性能数据发送到监控系统的逻辑
  // 例如：发送到服务器、存储到数据库等
  // 目前仅作为示例，实际实现需要根据项目需求进行调整
  
  const performanceData = {
    className: getClassName(target),
    methodName: String(propertyKey),
    executionTime,
    timestamp: new Date().toISOString(),
    error: error ? String(error) : undefined
  };
  
  // 示例：发送到控制台
  console.debug('Performance Report:', performanceData);
  
  // 实际实现可能类似：
  // fetch('/api/performance', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(performanceData)
  // });
}
